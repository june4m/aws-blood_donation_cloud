// import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
// import { motion } from "framer-motion";

// const bloodTypes = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"];

// const canReceiveFrom = {
//   "O-": ["O-"],
//   "O+": ["O-", "O+"],
//   "A-": ["O-", "A-"],
//   "A+": ["O-", "O+", "A-", "A+"],
//   "B-": ["O-", "B-"],
//   "B+": ["O-", "O+", "B-", "B+"],
//   "AB-": ["O-", "A-", "B-", "AB-"],
//   "AB+": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
// };

// const descriptions = {
//   "O-": "Nhóm O- chỉ có thể nhận máu từ O- nhưng có thể hiến cho tất cả các nhóm máu.",
//   "O+": "Nhóm O+ có thể nhận máu từ O-, O+ và hiến cho các nhóm máu dương tính.",
//   "A-": "Nhóm A- có thể nhận máu từ O-, A- và hiến cho A-, A+, AB-, AB+.",
//   "A+": "Nhóm A+ có thể nhận máu từ O-, O+, A-, A+ và hiến cho A+, AB+.",
//   "B-": "Nhóm B- có thể nhận máu từ O-, B- và hiến cho B-, B+, AB-, AB+.",
//   "B+": "Nhóm B+ có thể nhận máu từ O-, O+, B-, B+ và hiến cho B+, AB+.",
//   "AB-": "Nhóm AB- có thể nhận máu từ O-, A-, B-, AB- và hiến cho AB-, AB+.",
//   "AB+": "Nhóm AB+ là người nhận máu toàn cầu - có thể nhận từ tất cả các nhóm máu.",
// };

// export default function ReceiveMode() {
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

//     if (active) {
//       canReceiveFrom[active.type].forEach((donorType) => {
//         const i = bloodTypes.indexOf(donorType);
//         const dEl = donorRefs.current[i];
//         if (!dEl) return;
//         const dRect = dEl.getBoundingClientRect();
//         const x1 = dRect.left + dRect.width / 2 - cLeft;
//         const y1 = dRect.top + dRect.height - cTop;

//         const j = bloodTypes.indexOf(active.type);
//         const rEl = recRefs.current[j];
//         if (!rEl) return;
//         const rRect = rEl.getBoundingClientRect();
//         const x2 = rRect.left + rRect.width / 2 - cLeft;
//         const y2 = rRect.top - cTop;

//         const dx = x2 - x1;
//         const offsetX = Math.sign(dx) * Math.min(Math.abs(dx) * 0.2, 50);
//         const cy = (y1 + y2) / 2 - 30;

//         newPaths.push({
//           d: `M${x1},${y1} C${x1 + offsetX},${cy} ${x2 - offsetX},${cy} ${x2},${y2}`,
//           active: true,
//         });
//       });
//     }

//     setPaths(newPaths);
//   };

//   const highlightDonor = (dType) => {
//     return active && canReceiveFrom[active.type].includes(dType);
//   };

//   const highlightRecipient = (rType) => {
//     return active && active.type === rType;
//   };

//   const donorDrainPercent = (dType) => {
//     if (!active || !canReceiveFrom[active.type].includes(dType)) return 0;
//     return 75; // Fixed percentage for visual effect
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
//         className="relative w-full h-[500px] sm:h-[550px] md:h-[600px] bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-100 px-4 sm:px-8 py-8"
//       >
//         {/* Decorative background elements */}
//         <div className="absolute top-8 left-8 w-20 h-20 bg-blue-100 rounded-full opacity-30 animate-pulse"></div>
//         <div className="absolute bottom-8 right-8 w-16 h-16 bg-indigo-100 rounded-full opacity-40 animate-pulse delay-1000"></div>
//         <div className="absolute top-1/2 left-4 w-12 h-12 bg-cyan-100 rounded-full opacity-20"></div>

//         {/* Donor row */}
//         <div className="absolute top-6 left-0 right-0 flex items-center z-10 px-2">
//           <div className="hidden sm:flex items-center justify-end w-32 mr-4">
//             <span className="text-gray-800 font-bold text-sm md:text-base whitespace-nowrap bg-white px-3 py-1 rounded-md shadow-sm">
//               NHÓM MÁU CÓ
//             </span>
//           </div>
//           <div className="flex-1 flex justify-center">
//             <div className="grid grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-2xl">
//               {bloodTypes.map((type, i) => {
//                 const isDonor = highlightDonor(type);
//                 const drain = donorDrainPercent(type);
//                 const isNegative = type.includes("-");

//                 return (
//                   <div
//                     key={type}
//                     ref={(el) => (donorRefs.current[i] = el)}
//                     className={`relative w-14 h-20 sm:w-16 sm:h-24 border-2 rounded-xl shadow-lg overflow-hidden bg-white mx-auto transition-all duration-300 ${
//                       isNegative ? "border-blue-400" : "border-red-400"
//                     } ${isDonor ? "ring-4 ring-yellow-300" : ""}`}
//                   >
//                     <motion.div
//                       className={`absolute bottom-0 left-0 w-full ${
//                         isNegative ? "bg-blue-500" : "bg-red-500"
//                       }`}
//                       initial={{ height: "100%" }}
//                       animate={{ height: isDonor ? `${100 - drain}%` : "100%" }}
//                       transition={{ duration: 0.8, ease: "easeInOut" }}
//                     />
//                     <div className="relative flex items-center justify-center h-full">
//                       <span className="font-bold text-sm sm:text-base text-black">
//                         {type}
//                       </span>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>

//         {/* Recipient row */}
//         <div className="absolute bottom-6 left-0 right-0 flex items-center z-10 px-2">
//           <div className="hidden sm:flex items-center justify-end w-32 mr-4">
//             <span className="text-black font-bold text-sm md:text-base whitespace-nowrap bg-white px-3 py-1 rounded-md shadow-sm">
//               MÁU NHẬN TỪ
//             </span>
//           </div>
//           <div className="flex-1 flex justify-center">
//             <div className="grid grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-2xl">
//               {bloodTypes.map((type, i) => {
//                 const isRec = highlightRecipient(type);
//                 const isNegative = type.includes("-");

//                 return (
//                   <motion.div
//                     key={type}
//                     ref={(el) => (recRefs.current[i] = el)}
//                     onClick={() =>
//                       setActive((prev) =>
//                         prev?.type === type ? null : { type }
//                       )
//                     }
//                     className="cursor-pointer z-10 flex justify-center"
//                     whileTap={{ scale: 0.9 }}
//                     whileHover={{ scale: 1.05 }}
//                     transition={{ type: "spring", stiffness: 300 }}
//                   >
//                     <div
//                       className={`relative w-10 h-10 sm:w-12 sm:h-12 overflow-hidden border-2 rounded-full bg-white transition-all duration-300 ${
//                         isNegative ? "border-blue-400" : "border-red-400"
//                       } ${
//                         isRec ? "ring-4 ring-yellow-300 scale-110" : ""
//                       }`}
//                     >
//                       <motion.div
//                         className={`absolute bottom-0 left-0 w-full ${
//                           isNegative ? "bg-blue-500" : "bg-red-500"
//                         }`}
//                         initial={{ height: 0 }}
//                         animate={{ height: isRec ? "100%" : "0%" }}
//                         transition={{ duration: 0.6, ease: "easeInOut" }}
//                       />
//                       <div className="relative flex items-center justify-center h-full">
//                         <span className="font-bold text-xs sm:text-sm text-black">
//                           {type}
//                         </span>
//                       </div>
//                     </div>
//                   </motion.div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>

//         {/* SVG paths */}
//         <svg className="absolute inset-0 w-full h-full pointer-events-none">
//           {paths.map((p, i) => (
//             <motion.path
//               key={`path-${i}`}
//               d={p.d}
//               stroke="#3B82F6"
//               strokeWidth={3}
//               fill="none"
//               initial={{ pathLength: 0, opacity: 0 }}
//               animate={{ pathLength: 1, opacity: 1 }}
//               transition={{ duration: 0.8, ease: "easeInOut" }}
//             />
//           ))}
//           {active &&
//             paths.map(
//               (p, i) =>
//                 p.active && (
//                   <motion.circle
//                     key={`drop-${active.type}-${i}`}
//                     r={4}
//                     fill="#3B82F6"
//                     style={{
//                       offsetPath: `path('${p.d}')`,
//                       offsetRotate: "auto",
//                     }}
//                     initial={{ offsetDistance: "100%" }}
//                     animate={{ offsetDistance: "0%" }}
//                     transition={{ duration: 1.5, ease: "easeInOut", repeat: 0 }}
//                   />
//                 )
//             )}
//         </svg>
//       </div>

//       {/* Description */}
//       {active && (
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.3 }}
//           className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200"
//         >
//           <p className="text-center text-black text-sm sm:text-base">
//             <span className="font-bold text-lg text-black">{active.type}:</span> {descriptions[active.type]}
//           </p>
//         </motion.div>
//       )}
//     </>
//   );
// }