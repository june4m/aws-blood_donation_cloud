// import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
// import { motion } from "framer-motion";

// const bloodTypes = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"];

// const canDonateTo = {
//   "O-": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
//   "O+": ["O+", "A+", "B+", "AB+"],
//   "A-": ["A-", "A+", "AB-", "AB+"],
//   "A+": ["A+", "AB+"],
//   "B-": ["B-", "B+", "AB-", "AB+"],
//   "B+": ["B+", "AB+"],
//   "AB-": ["AB-", "AB+"],
//   "AB+": ["AB+"],
// };

// const descriptions = {
//   "O-": "Nhóm O- là người hiến máu toàn cầu - có thể hiến cho tất cả các nhóm máu nhưng chỉ nhận từ O-.",
//   "O+": "Nhóm O+ có thể hiến cho các nhóm máu dương (O+, A+, B+, AB+) và nhận từ O-, O+.",
//   "A-": "Nhóm A- có thể hiến cho A-, A+, AB-, AB+ và nhận từ O-, A-.",
//   "A+": "Nhóm A+ có thể hiến cho A+, AB+ và nhận từ O-, O+, A-, A+.",
//   "B-": "Nhóm B- có thể hiến cho B-, B+, AB-, AB+ và nhận từ O-, B-.",
//   "B+": "Nhóm B+ có thể hiến cho B+, AB+ và nhận từ O-, O+, B-, B+.",
//   "AB-": "Nhóm AB- có thể hiến cho AB-, AB+ và nhận từ O-, A-, B-, AB-.",
//   "AB+": "Nhóm AB+ chỉ có thể hiến cho AB+ nhưng có thể nhận từ tất cả các nhóm máu.",
// };

// export default function DonateMode() {
//   const [active, setActive] = useState(null);
//   const [paths, setPaths] = useState([]);
//   const containerRef = useRef(null);
//   const donorRefs = useRef([]);
//   const recRefs = useRef([]);
//   const [resizeTrigger, setResizeTrigger] = useState(0);

//   const calculatePaths = () => {
//     const cont = containerRef.current;
//     if (!cont) return;
//     const { left: cLeft, top: cTop } = cont.getBoundingClientRect();
//     const newPaths = [];

//     bloodTypes.forEach((dType, i) => {
//       const dEl = donorRefs.current[i];
//       if (!dEl) return;
//       const dRect = dEl.getBoundingClientRect();
//       const x1 = dRect.left + dRect.width / 2 - cLeft;
//       const y1 = dRect.top + dRect.height - cTop;

//       canDonateTo[dType].forEach((rType) => {
//         const j = bloodTypes.indexOf(rType);
//         const rEl = recRefs.current[j];
//         if (!rEl) return;
//         const rRect = rEl.getBoundingClientRect();
//         const x2 = rRect.left + rRect.width / 2 - cLeft;
//         const y2 = rRect.top - cTop;

//         const dx = x2 - x1;
//         const offsetX = Math.sign(dx) * Math.min(Math.abs(dx) * 0.3, 60);
//         const cy = (y1 + y2) / 2 - 40;

//         const isActive = active && active.type === dType;

//         newPaths.push({
//           d: `M${x1},${y1} C${x1 + offsetX},${cy} ${x2 - offsetX},${cy} ${x2},${y2}`,
//           active: isActive,
//         });
//       });
//     });

//     setPaths(newPaths);
//   };

//   const highlightDonor = (dType) => {
//     return active && active.type === dType;
//   };

//   const highlightRecipient = (rType) => {
//     return active && canDonateTo[active.type].includes(rType);
//   };

//   const donorDrainPercent = (dType) => {
//     if (!active || active.type !== dType) return 0;
//     return (canDonateTo[dType].length / bloodTypes.length) * 100;
//   };

//   useLayoutEffect(calculatePaths, [active, resizeTrigger]);
//   useEffect(() => {
//     const onResize = () => setResizeTrigger(Date.now());
//     window.addEventListener("resize", onResize);
//     return () => window.removeEventListener("resize", onResize);
//   }, []);

//   return (
//     <>
//       <div
//         ref={containerRef}
//         className="relative w-full h-[500px] sm:h-[550px] md:h-[600px] bg-gradient-to-br from-red-50 via-pink-50 to-rose-100 px-4 sm:px-8 py-8"
//       >
//         {/* Decorative background elements */}
//         <div className="absolute top-8 left-8 w-20 h-20 bg-red-100 rounded-full opacity-30 animate-pulse"></div>
//         <div className="absolute bottom-8 right-8 w-16 h-16 bg-pink-100 rounded-full opacity-40 animate-pulse delay-1000"></div>
//         <div className="absolute top-1/2 left-4 w-12 h-12 bg-rose-100 rounded-full opacity-20"></div>

//         {/* Enhanced Donor row */}
//         <div className="absolute top-8 left-0 right-0 flex items-center z-10 px-4">
//           <div className="hidden sm:flex items-center justify-end w-40 mr-6">
//             <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-xl shadow-lg">
//               <div className="flex items-center gap-2">
//                 <span className="text-xl">🩸</span>
//                 <div>
//                   <div className="font-bold text-sm">NGƯỜI HIẾN</div>
//                   <div className="text-xs opacity-90">Chọn nhóm máu</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="flex-1 flex justify-center">
//             <div className="grid grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-3xl">
//               {bloodTypes.map((type, i) => {
//                 const isDonor = highlightDonor(type);
//                 const drain = donorDrainPercent(type);
//                 const isNegative = type.includes("-");

//                 return (
//                   <motion.div
//                     key={type}
//                     ref={(el) => (donorRefs.current[i] = el)}
//                     onClick={() =>
//                       setActive((prev) =>
//                         prev?.type === type ? null : { type }
//                       )
//                     }
//                     className="cursor-pointer z-10 flex justify-center group"
//                     whileTap={{ scale: 0.9 }}
//                     whileHover={{ scale: 1.05 }}
//                     transition={{ type: "spring", stiffness: 300 }}
//                   >
//                     <div
//                       className={`relative w-16 h-24 sm:w-18 sm:h-28 md:w-20 md:h-32 border-3 rounded-2xl shadow-xl overflow-hidden bg-white transition-all duration-300 ${
//                         isNegative
//                           ? "border-blue-400 hover:border-blue-500"
//                           : "border-red-400 hover:border-red-500"
//                       } ${
//                         isDonor
//                           ? "ring-4 ring-yellow-400 ring-opacity-60 shadow-2xl"
//                           : ""
//                       } group-hover:shadow-2xl`}
//                     >
//                       {/* Gradient overlay when active */}
//                       {isDonor && (
//                         <div className="absolute inset-0 bg-gradient-to-t from-yellow-200/30 to-transparent z-10"></div>
//                       )}

//                       <motion.div
//                         className={`absolute bottom-0 left-0 w-full ${
//                           isNegative
//                             ? "bg-gradient-to-t from-blue-600 to-blue-500"
//                             : "bg-gradient-to-t from-red-600 to-red-500"
//                         }`}
//                         initial={{ height: "100%" }}
//                         animate={{ height: isDonor ? `${100 - drain}%` : "100%" }}
//                         transition={{ duration: 1, ease: "easeInOut" }}
//                       />

//                       {/* Shine effect */}
//                       <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>

//                       <div className="relative flex items-center justify-center h-full z-20">
//                         <span className="font-bold text-sm sm:text-base md:text-lg text-black transition-all duration-300">
//                           {type}
//                         </span>
//                       </div>

//                       {/* Pulse effect when active */}
//                       {isDonor && (
//                         <motion.div
//                           className="absolute inset-0 border-2 border-yellow-400 rounded-2xl"
//                           animate={{ scale: [1, 1.1, 1] }}
//                           transition={{ duration: 2, repeat: Infinity }}
//                         />
//                       )}
//                     </div>
//                   </motion.div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>

//         {/* Enhanced Recipient row */}
//         <div className="absolute bottom-8 left-0 right-0 flex items-center z-10 px-4">
//           <div className="hidden sm:flex items-center justify-end w-40 mr-6">
//             <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg">
//               <div className="flex items-center gap-2">
//                 <span className="text-xl">🫴</span>
//                 <div>
//                   <div className="font-bold text-sm">NGƯỜI NHẬN</div>
//                   <div className="text-xs opacity-90">Kết quả tương thích</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="flex-1 flex justify-center">
//             <div className="grid grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-3xl">
//               {bloodTypes.map((type, i) => {
//                 const isRec = highlightRecipient(type);
//                 const isNegative = type.includes("-");

//                 return (
//                   <div
//                     key={type}
//                     ref={(el) => (recRefs.current[i] = el)}
//                     className={`relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 overflow-hidden border-3 rounded-full bg-white mx-auto transition-all duration-500 shadow-lg ${
//                       isNegative
//                         ? "border-blue-400"
//                         : "border-red-400"
//                     } ${
//                       isRec
//                         ? "ring-4 ring-green-400 ring-opacity-60 scale-110 shadow-2xl"
//                         : ""
//                     }`}
//                   >
//                     {/* Glow effect when compatible */}
//                     {isRec && (
//                       <div className="absolute inset-0 bg-gradient-to-r from-green-200/50 to-emerald-200/50 rounded-full animate-pulse"></div>
//                     )}

//                     <motion.div
//                       className={`absolute bottom-0 left-0 w-full ${
//                         isNegative
//                           ? "bg-gradient-to-t from-blue-600 to-blue-500"
//                           : "bg-gradient-to-t from-red-600 to-red-500"
//                       }`}
//                       initial={{ height: 0 }}
//                       animate={{ height: isRec ? "100%" : "0%" }}
//                       transition={{ duration: 0.8, ease: "easeInOut" }}
//                     />

//                     <div className="relative flex items-center justify-center h-full z-10">
//                       <span className="font-bold text-xs sm:text-sm text-black transition-all duration-300">
//                         {type}
//                       </span>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>

//         {/* Enhanced SVG paths */}
//         <svg className="absolute inset-0 w-full h-full pointer-events-none">
//           <defs>
//             <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
//               <stop offset="0%" stopColor="#ef4444" stopOpacity="1" />
//               <stop offset="100%" stopColor="#dc2626" stopOpacity="0.8" />
//             </linearGradient>
//             <filter id="glow">
//               <feGaussianBlur stdDeviation="3" result="coloredBlur" />
//               <feMerge>
//                 <feMergeNode in="coloredBlur" />
//                 <feMergeNode in="SourceGraphic" />
//               </feMerge>
//             </filter>
//           </defs>

//           {paths.map((p, i) => (
//             <motion.path
//               key={`path-${i}`}
//               d={p.d}
//               stroke={p.active ? "url(#pathGradient)" : "#d1d5db"}
//               strokeWidth={p.active ? 4 : 2}
//               fill="none"
//               filter={p.active ? "url(#glow)" : "none"}
//               initial={{ pathLength: 0, opacity: 0 }}
//               animate={{ pathLength: 1, opacity: p.active ? 1 : 0.3 }}
//               transition={{ duration: 1, ease: "easeInOut" }}
//             />
//           ))}

//           {active &&
//             paths.map(
//               (p, i) =>
//                 p.active && (
//                   <motion.circle
//                     key={`drop-${active.type}-${i}`}
//                     r={5}
//                     fill="url(#pathGradient)"
//                     filter="url(#glow)"
//                     style={{
//                       offsetPath: `path('${p.d}')`,
//                       offsetRotate: "auto",
//                     }}
//                     initial={{ offsetDistance: "0%" }}
//                     animate={{ offsetDistance: "100%" }}
//                     transition={{
//                       duration: 2,
//                       ease: "easeInOut",
//                       repeat: 0,
//                       delay: i * 0.1,
//                     }}
//                   />
//                 )
//             )}
//         </svg>
//       </div>

//       {/* Enhanced Description */}
//       {active && (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.3 }}
//           className="m-6 p-6 bg-gradient-to-r from-red-50 via-pink-50 to-rose-50 rounded-2xl border border-red-200 shadow-lg"
//         >
//           <div className="flex items-start gap-4">
//             <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
//               {active.type}
//             </div>
//             <div className="flex-1">
//               <h3 className="text-lg font-bold text-black mb-2">
//                 Thông tin nhóm máu {active.type}
//               </h3>
//               <p className="text-black leading-relaxed">
//                 {descriptions[active.type]}
//               </p>
//               <div className="mt-4 flex items-center gap-2 text-sm text-black">
//                 <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
//                 Tương thích với {canDonateTo[active.type].length}/8 nhóm máu
//               </div>
//             </div>
//           </div>
//         </motion.div>
//       )}
//     </>
//   );
// }