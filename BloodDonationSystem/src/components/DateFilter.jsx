import { useState, useEffect } from "react";
import { FaCalendarAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";

export function DateFilter({ onSearch, onDateChange, startDate, endDate, modernStyle }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedStartDate, setSelectedStartDate] = useState(startDate ? new Date(startDate) : null);
  const [selectedEndDate, setSelectedEndDate] = useState(endDate ? new Date(endDate) : null);

  // Sync với props khi có thay đổi
  useEffect(() => {
    if (startDate) {
      setSelectedStartDate(new Date(startDate));
    }
    if (endDate) {
      setSelectedEndDate(new Date(endDate));
    }
  }, [startDate, endDate]);

  // Format date để hiển thị
  const formatDisplayDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  // Tạo calendar
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay(); // 0 = Sunday

    const days = [];
    
    // Thêm ngày trống cho tuần đầu (chuyển Sunday=0 thành Monday=0)
    const adjustedStartDay = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
    for (let i = 0; i < adjustedStartDay; i++) {
      days.push(null);
    }
    
    // Thêm các ngày trong tháng
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  // Xử lý khi click ngày
  const handleDateClick = (date) => {
    if (!date || date < new Date().setHours(0,0,0,0)) return;
    
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      // Bắt đầu chọn range mới
      setSelectedStartDate(date);
      setSelectedEndDate(null);
      onDateChange([date.toISOString().split('T')[0], null]);
    } else if (selectedStartDate && !selectedEndDate) {
      // Chọn end date
      if (date >= selectedStartDate) {
        setSelectedEndDate(date);
        onDateChange([
          selectedStartDate.toISOString().split('T')[0],
          date.toISOString().split('T')[0]
        ]);
      } else {
        // Nếu chọn ngày trước start date, đặt làm start date mới
        setSelectedStartDate(date);
        setSelectedEndDate(null);
        onDateChange([date.toISOString().split('T')[0], null]);
      }
    }
  };

  // Kiểm tra ngày có trong range không
  const isDateInRange = (date) => {
    if (!selectedStartDate || !selectedEndDate || !date) return false;
    return date >= selectedStartDate && date <= selectedEndDate;
  };

  // Kiểm tra ngày có được chọn không
  const isDateSelected = (date) => {
    if (!date) return false;
    return (selectedStartDate && date.getTime() === selectedStartDate.getTime()) ||
           (selectedEndDate && date.getTime() === selectedEndDate.getTime());
  };

  // Tháng hiện tại
  const currentMonth = currentDate.toLocaleDateString("vi-VN", { month: "long", year: "numeric" });
  const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
  const nextMonthName = nextMonth.toLocaleDateString("vi-VN", { month: "long", year: "numeric" });

  const currentMonthDays = getDaysInMonth(currentDate);
  const nextMonthDays = getDaysInMonth(nextMonth);

  // Tạo display text
  const getDisplayText = () => {
    if (selectedStartDate && selectedEndDate) {
      return `${formatDisplayDate(selectedStartDate)} - ${formatDisplayDate(selectedEndDate)}`;
    } else if (selectedStartDate) {
      return formatDisplayDate(selectedStartDate);
    }
    return "";
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      {/* Header với icon và title */}
      <div className="bg-white px-6 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <FaCalendarAlt className="text-red-600 text-xl mr-3" />
          <span className="font-medium text-gray-800 text-lg">
            Bạn cần đặt lịch vào thời gian nào?
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-4">
        {/* Date Range Input */}
        <div className="relative mb-4">
          <input
            type="text"
            value={getDisplayText()}
            onClick={() => setIsOpen(!isOpen)}
            readOnly
            placeholder="Chọn ngày hiến máu"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-700"
          />
          <FaCalendarAlt 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>

        {/* Calendar Dropdown */}
        {isOpen && (
          <div className="border border-gray-200 rounded-lg shadow-lg bg-white p-4 mb-4 relative z-10">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FaChevronLeft className="text-gray-600" />
              </button>
              <div className="flex space-x-8">
                <span className="font-semibold text-gray-800 capitalize text-sm">{currentMonth}</span>
                <span className="font-semibold text-gray-800 capitalize text-sm">{nextMonthName}</span>
              </div>
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FaChevronRight className="text-gray-600" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Tháng hiện tại */}
              <div>
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7', 'CN'].map(day => (
                    <div key={day} className="text-center text-xs text-gray-500 font-medium py-1">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {currentMonthDays.map((date, index) => (
                    <div
                      key={index}
                      onClick={() => handleDateClick(date)}
                      className={`
                        h-8 w-8 flex items-center justify-center text-xs cursor-pointer rounded-full transition-all
                        ${!date ? 'cursor-default' : ''}
                        ${date && date < new Date().setHours(0,0,0,0) ? 'text-gray-300 cursor-not-allowed' : ''}
                        ${date && isDateSelected(date) ? 'bg-red-600 text-white font-medium' : ''}
                        ${date && isDateInRange(date) && !isDateSelected(date) ? 'bg-red-100 text-red-600' : ''}
                        ${date && date >= new Date().setHours(0,0,0,0) && !isDateSelected(date) && !isDateInRange(date) ? 'hover:bg-gray-100 text-gray-700' : ''}
                      `}
                    >
                      {date ? date.getDate() : ''}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tháng tiếp theo */}
              <div>
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7', 'CN'].map(day => (
                    <div key={day} className="text-center text-xs text-gray-500 font-medium py-1">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {nextMonthDays.map((date, index) => (
                    <div
                      key={index}
                      onClick={() => handleDateClick(date)}
                      className={`
                        h-8 w-8 flex items-center justify-center text-xs cursor-pointer rounded-full transition-all
                        ${!date ? 'cursor-default' : ''}
                        ${date && date < new Date().setHours(0,0,0,0) ? 'text-gray-300 cursor-not-allowed' : ''}
                        ${date && isDateSelected(date) ? 'bg-red-600 text-white font-medium' : ''}
                        ${date && isDateInRange(date) && !isDateSelected(date) ? 'bg-red-100 text-red-600' : ''}
                        ${date && date >= new Date().setHours(0,0,0,0) && !isDateSelected(date) && !isDateInRange(date) ? 'hover:bg-gray-100 text-gray-700' : ''}
                      `}
                    >
                      {date ? date.getDate() : ''}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search Button */}
        <button 
          onClick={() => {
            setIsOpen(false);
            onSearch();
          }}
          className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Tìm kiếm
        </button>
      </div>
    </div>
  );
}

export default DateFilter;