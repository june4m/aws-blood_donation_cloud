// export async function getCoordinatesFromAddress(address) {
//   const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
//   const response = await fetch(url, {
//     headers: {
//       'Accept-Language': 'vi',
//       'User-Agent': 'BloodDonationSystem/1.0 (daivietblood@gmail.com)'
//     }
//   });
//   const data = await response.json();
//   // Lọc kết quả chỉ lấy địa chỉ ở Việt Nam
//   const vnResult = data.find(item => item.display_name && item.display_name.includes("Việt Nam"));
//   if (vnResult) {
//     return {
//       latitude: vnResult.lat,
//       longitude: vnResult.lon,
//       display_name: vnResult.display_name
//     };
//   }
//   throw new Error('Không tìm thấy địa chỉ này tại Việt Nam');
// }