// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { AiOutlineEyeInvisible } from "react-icons/ai";
// import { AiOutlineEye } from "react-icons/ai";
// export const LoginPage = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   return (
//     <>
//       <div className="flex items-center justify-center min-h-screen bg-[#FFFFFF]">
//         <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md ">
//           <h2 className="text-3xl font-bold text-center text-[#D32F2F]">
//             Login
//           </h2>
//           <form className="space-y-5">
//             <div className="space-y-2">
//               <label className="block text-[#555555]">Email:</label>
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Enter your email"
//                 className="w-full px-4 py-2 border rounded"
//               />
//               <label className="block text-[#555555]">Password:</label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   placeholder="Enter your password"
//                   className="w-full px-4 py-2 border rounded"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute inset-y-0 right-0 flex items-center pr-3"
//                 >
//                   {showPassword ? (
//                     <AiOutlineEyeInvisible className="text-gray-500 hover:text-gray-700 w-5 h-5" />
//                   ) : (
//                     <AiOutlineEye className="text-gray-500 hover:text-gray-700 w-5 h-5" />
//                   )}
//                 </button>
//               </div>
//             </div>
//             <div className="space-y-2">
//               <button
//                 type="submit"
//                 className="w-full py-2 px-4 bg-[#D32F2F] text-white font-semibold rounded transition duration-200"
//               >
//                 Login
//               </button>
//               <Link
//                 to="/forgot-password"
//                 className="block text-[#0000EE] hover:underline text-center font-semibold"
//               >
//                 Forgot Pasword?
//               </Link>
//             </div>
//           </form>
//           <div className="flex justify-center">
//             <span className="text-[#1F1F1F]">Don't have an account?</span>{" "}
//             <Link to="/register" className="block text-[#D32F2F]">
//               <span className="hover:underline"> Register</span>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };
