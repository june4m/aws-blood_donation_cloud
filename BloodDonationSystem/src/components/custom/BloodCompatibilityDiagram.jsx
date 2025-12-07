import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import { motion } from "framer-motion";

/* ---------- Data ---------------------------------------------------- */
const ABO_TYPES = ["O", "A", "B", "AB"];
const ABO_RULES = {
  O: ["O", "A", "B", "AB"],
  A: ["A", "AB"],
  B: ["B", "AB"],
  AB: ["AB"],
};

const ABO_DESC = {
  O: "Nhóm O hiến hồng cầu cho mọi nhóm máu",
  A: "Nhóm A hiến cho A và AB",
  B: "Nhóm B hiến cho B và AB",
  AB: "Nhóm AB chỉ hiến cho AB nhưng nhận từ tất cả",
};

const RH_TYPES = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"];
const RH_RULES = {
  "O-": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
  "O+": ["O+", "A+", "B+", "AB+"],
  "A-": ["A-", "A+", "AB-", "AB+"],
  "A+": ["A+", "AB+"],
  "B-": ["B-", "B+", "AB-", "AB+"],
  "B+": ["B+", "AB+"],
  "AB-": ["AB-", "AB+"],
  "AB+": ["AB+"],
};

const RH_DESC = {
  "O-": "O- âm hiến cho tất cả",
  "O+": "O+ hiến cho các nhóm Rh dương",
  "A-": "A- âm hiến cho A-/A+ & AB-/AB+",
  "A+": "A+ hiến cho A+ và AB+",
  "B-": "B- âm hiến cho B-/B+ & AB-/AB+",
  "B+": "B+ hiến cho B+ và AB+",
  "AB-": "AB- âm hiến cho AB- và AB+",
  "AB+": "AB+ chỉ hiến cho AB+ nhưng nhận từ tất cả",
};

export default function BloodCompatibilityDiagram({ withRh = false }) {
  /* ----- chọn bộ dữ liệu theo prop ---------------------------------- */
  const bloodTypes = withRh ? RH_TYPES : ABO_TYPES;
  const canDonateTo = withRh ? RH_RULES : ABO_RULES;
  const descriptions = withRh ? RH_DESC : ABO_DESC;

  /* ----- state & refs ------------------------------------------------ */
  const [active, setActive] = useState(null);
  const [paths, setPaths] = useState([]);
  const containerRef = useRef(null);
  const donorRefs = useRef([]);
  const recRefs = useRef([]);
  const [resizeTrigger, setResizeTrigger] = useState(0);

  /* ----- helpers ----------------------------------------------------- */
  const highlightDonor = (d) =>
    active && active.role === "donor" && d === active.type;

  const highlightRecipient = (r) =>
    active && active.role === "donor" && canDonateTo[active.type].includes(r);

  const donorDrainPercent = (d) =>
    active && active.role === "donor" && active.type === d
      ? (canDonateTo[d].length / bloodTypes.length) * 100
      : 0;

  /* ----- vẽ đường Bézier -------------------------------------------- */
  const calculatePaths = () => {
    const cont = containerRef.current;
    if (!cont) return;
    const { left: cLeft, top: cTop } = cont.getBoundingClientRect();
    const newPaths = [];

    if (active?.role === "donor") {
      // Chỉ vẽ khi click vào donor - hiển thị donor có thể hiến cho ai
      const dType = active.type;
      const dIndex = bloodTypes.indexOf(dType);
      const dEl = donorRefs.current[dIndex];
      if (dEl) {
        const dRect = dEl.getBoundingClientRect();
        const x1 = dRect.left + dRect.width / 2 - cLeft;
        const y1 = dRect.top + dRect.height - cTop;

        canDonateTo[dType].forEach((rType) => {
          const j = bloodTypes.indexOf(rType);
          const rEl = recRefs.current[j];
          if (!rEl) return;
          const rRect = rEl.getBoundingClientRect();
          const x2 = rRect.left + rRect.width / 2 - cLeft;
          const y2 = rRect.top - cTop;

          const dx = x2 - x1;
          const offsetX = Math.sign(dx) * Math.min(Math.abs(dx) * 0.3, 100);
          const cy = (y1 + y2) / 2 - 50;

          newPaths.push({
            d: `M${x1},${y1} C${x1 + offsetX},${cy} ${
              x2 - offsetX
            },${cy} ${x2},${y2}`,
            active: true,
          });
        });
      }
    }

    setPaths(newPaths);
  };

  useLayoutEffect(calculatePaths, [
    active,
    resizeTrigger,
    withRh,
    bloodTypes,
    canDonateTo,
  ]);
  useEffect(() => {
    const onResize = () => setResizeTrigger(Date.now());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ----- UI ---------------------------------------------------------- */
  return (
    <>
      {/* Chú thích */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full text-center mb-4 px-2"
      >
        <span className="text-gray-700 text-xs sm:text-sm md:text-base font-medium">
          “Chọn nhóm máu để xem khả năng hiến / nhận.”
        </span>
      </motion.div>

      {/* Khung sơ đồ */}
      <div
        ref={containerRef}
        className="relative w-full h-[320px] rounded-xl sm:h-[360px] md:h-[400px] lg:h-[440px] bg-gray-50 px-1 sm:px-3 overflow-hidden"
      >
        {/* Hàng donor */}
        <div className="absolute top-3 left-0 right-0 flex items-center z-10 px-1">
          <div className="hidden sm:flex items-center justify-end w-35">
            <span className="font-semibold text-sm sm:text-base md:text-lg">
              NHÓM MÁU CHO
            </span>
          </div>
          <div
            className={`flex-1 grid ${
              withRh ? "grid-cols-8" : "grid-cols-4"
            } gap-x-2 sm:gap-x-3 md:gap-x-4 justify-items-center`}
          >
            {bloodTypes.map((type, i) => {
              const isDonor = highlightDonor(type);
              const drain = donorDrainPercent(type);
              return (
                <motion.div
                  key={type}
                  ref={(el) => (donorRefs.current[i] = el)}
                  onClick={() =>
                    setActive((prev) =>
                      prev?.type === type && prev.role === "donor"
                        ? null
                        : { type, role: "donor" }
                    )
                  }
                  className="cursor-pointer z-10"
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="relative w-10 h-16 sm:w-12 sm:h-18 md:w-14 md:h-20 border rounded-lg shadow-md overflow-hidden bg-white">
                    <motion.div
                      className="absolute bottom-0 left-0 w-full bg-red-500"
                      initial={{ height: "100%" }}
                      animate={{ height: isDonor ? `${100 - drain}%` : "100%" }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    />
                    <div className="relative flex items-center justify-center h-full">
                      <span
                        className={`font-bold text-xs sm:text-sm md:text-base ${
                          isDonor ? "text-black" : "text-gray-700"
                        }`}
                      >
                        {type}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Hàng recipient */}
        <div className="absolute bottom-20 left-0 right-0 flex items-center z-10 px-1">
          <div className="hidden sm:flex items-center justify-end w-35">
            <span className="font-semibold text-sm sm:text-base md:text-lg">
              NHÓM MÁU NHẬN
            </span>
          </div>
          <div
            className={`flex-1 grid ${
              withRh ? "grid-cols-8" : "grid-cols-4"
            } gap-x-2 sm:gap-x-3 md:gap-x-4 justify-items-center`}
          >
            {bloodTypes.map((type, i) => {
              const isRec = highlightRecipient(type);
              return (
                <div
                  key={type}
                  ref={(el) => (recRefs.current[i] = el)}
                  className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 overflow-hidden border rounded-full bg-white select-none"
                >
                  <motion.div
                    className="absolute bottom-0 left-0 w-full bg-red-500"
                    initial={{ height: 0 }}
                    animate={{ height: isRec ? "100%" : "0%" }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  />
                  <div className="relative flex items-center justify-center h-full">
                    <span
                      className={`font-bold ${
                        withRh ? "text-[10px] sm:text-xs" : "text-xs sm:text-sm"
                      } ${isRec ? "text-white" : "text-gray-600"}`}
                    >
                      {type}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Đường nối + animation */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {paths.map((p, i) => (
            <motion.path
              key={`path-${i}`}
              d={p.d}
              stroke={p.active ? "#EF4444" : "#E5E7EB"}
              fill="none"
              initial={{
                pathLength: 0,
                strokeOpacity: p.active ? 0.3 : 0.06,
                strokeWidth: 1,
              }}
              animate={{
                pathLength: 1,
                strokeOpacity: p.active ? 1 : 0.06,
                strokeWidth: p.active ? 3 : 1,
              }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          ))}

          {/* giọt máu chạy dọc dây khi click donor */}
          {active?.role === "donor" &&
            paths.map(
              (p, i) =>
                p.active && (
                  <motion.circle
                    key={`drop-donor-${active.type}-${i}`}
                    r={4}
                    fill="#EF4444"
                    style={{
                      offsetPath: `path('${p.d}')`,
                      offsetRotate: "auto",
                    }}
                    initial={{ offsetDistance: "0%" }}
                    animate={{ offsetDistance: "100%" }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                  />
                )
            )}
        </svg>

        {/* Mô tả nhóm máu */}
        {active && (
          <div className="absolute left-2 right-2 bottom-4 z-20">
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
                scale: 0.9,
                filter: "blur(4px)",
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                filter: "blur(0px)",
              }}
              exit={{
                opacity: 0,
                y: -10,
                scale: 0.95,
                filter: "blur(2px)",
              }}
              transition={{
                duration: 0.6,
                delay: 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-xl border border-gray-200 mx-auto max-w-md"
            >
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.5,
                  ease: "easeOut",
                }}
                className="text-center text-gray-700 text-xs sm:text-sm md:text-base font-medium"
              >
                {descriptions[active.type]}
              </motion.p>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
}
