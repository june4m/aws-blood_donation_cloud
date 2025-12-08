import { useState, useCallback } from "react";

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_BASE = import.meta.env.VITE_API_URL || "";
  const BASE_URL = `${API_BASE}/api`;
  const AUTH_URL = `${API_BASE}/auth`;

  // Auth utilities
  const isLoggedIn = useCallback(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  }, []);

  const clearAuthData = useCallback(() => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
  }, []);

  // Public API caller (no credentials - for public endpoints like blogs)
  const callPublicApi = useCallback(async (endpoint, options = {}) => {
    const url = `${BASE_URL}${endpoint}`;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP Error: ${response.status}`);
      }

      return data;
    } catch (err) {
      setError(err.message);
      console.error(`API Error [${endpoint}]:`, err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Main API caller with credentials support (for authenticated endpoints)
  const callApi = useCallback(
    async (endpoint, options = {}) => {
      const url = `${BASE_URL}${endpoint}`;
      setLoading(true);
      setError(null);

      console.log("API Request:", url);

      try {
        const response = await fetch(url, {
          credentials: "include", // Include cookies for auth
          headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
          },
          ...options,
        });

        console.log("API response status:", response.status);

        // Xử lý 401 - Authentication error
        if (response.status === 401) {
          if (window.location.pathname !== "/login") {
            clearAuthData();
            setTimeout(() => {
              window.location.href = "/login";
            }, 100);
          }
          throw new Error("Session expired");
        }

        const data = await response.json();

        if (!response.ok) {
          const errorMessage =
            data.message || data.error || `HTTP Error: ${response.status}`;
          throw new Error(errorMessage);
        }

        if (data.status === false && data.message) {
          throw new Error(data.message);
        }

        return data;
      } catch (err) {
        const errorMessage = err.message || "API call failed";
        setError(errorMessage);
        console.error(`API Error [${endpoint}]:`, errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [clearAuthData]
  );

  // Auth API caller (uses /auth endpoint)
  const callAuthApi = useCallback(async (endpoint, options = {}) => {
    const url = `${AUTH_URL}${endpoint}`;
    setLoading(true);
    setError(null);

    console.log("Auth API Request:", url);

    try {
      const response = await fetch(url, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP Error: ${response.status}`);
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Auth APIs using Cognito
  const login = useCallback(
    async (credentials) => {
      console.log("Sending Cognito login request");

      const result = await callAuthApi("/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });

      if (result.status) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user", JSON.stringify(result.data));
      }

      return result;
    },
    [callAuthApi]
  );

  const logout = useCallback(async () => {
    try {
      await callAuthApi("/logout", { method: "POST" });
    } catch {
      console.log("Logout failed, clearing local data");
    } finally {
      clearAuthData();
      window.location.href = "/login";
    }
  }, [callAuthApi, clearAuthData]);

  const register = useCallback(
    async (userData) => {
      return callAuthApi("/register", {
        method: "POST",
        body: JSON.stringify(userData),
      });
    },
    [callAuthApi]
  );

  const confirmEmail = useCallback(
    async (email, code) => {
      return callAuthApi("/confirm-email", {
        method: "POST",
        body: JSON.stringify({ email, code }),
      });
    },
    [callAuthApi]
  );

  // Data APIs
  const getCurrentUser = useCallback(async () => {
    return callAuthApi("/me");
  }, [callAuthApi]);

  const getSlotList = useCallback(async () => {
    return callPublicApi("/getSlotList");
  }, [callPublicApi]);

  const registerSlot = useCallback(
    async (slotId, user_id, extraData = {}) => {
      return callApi("/registerSlot", {
        method: "POST",
        body: JSON.stringify({
          Slot_ID: slotId,
          User_ID: user_id,
          ...extraData,
        }),
      });
    },
    [callApi]
  );

  const createSlot = useCallback(
    async (slotData) => {
      return callApi("/createSlot", {
        method: "POST",
        body: JSON.stringify(slotData),
      });
    },
    [callApi]
  );

  const updateUser = useCallback(
    async (userData) => {
      return callApi("/profile", {
        method: "PUT",
        body: JSON.stringify(userData),
      });
    },
    [callApi]
  );

  const getBloodTypes = useCallback(async () => {
    return callApi("/bloodtypes");
  }, [callApi]);

  const getAppointments = useCallback(async () => {
    return callApi("/appointment");
  }, [callApi]);

  const addAppointmentVolume = useCallback(
    async (appointmentId, volume) => {
      return callApi(`/appointment/${appointmentId}/addVolume`, {
        method: "POST",
        body: JSON.stringify({ volume }),
      });
    },
    [callApi]
  );

  //Emergency Request API
  const addEmergencyRequest = useCallback(
    async (requestData) => {
      return callApi("/requestEmergencyBlood", {
        method: "POST",
        body: JSON.stringify(requestData),
      });
    },
    [callApi]
  );

  // Thêm API gọi addPatientDetail (BE: POST /appointment/:appointmentId/addPatient)
  const addPatientDetail = useCallback(
    async (appointmentId, description, status) => {
      return callApi(`/patientDetailV2/${appointmentId}/patient`, {
        method: "POST",
        body: JSON.stringify({ description, status }),
      });
    },
    [callApi]
  );

  const confirmBloodTypeByStaff = useCallback(
    async (userId, bloodType) => {
      return callApi(`/users/${userId}/confirmBloodTypeByStaff`, {
        method: "PUT",
        body: JSON.stringify({ bloodType }),
      });
    },
    [callApi]
  );

  const updateStatusAppointmentByStaff = useCallback(
    async (appointmentId, newStatus) => {
      return callApi(`/appointment/${appointmentId}/status`, {
        method: "PUT",
        body: JSON.stringify({ newStatus }),
      });
    },
    [callApi]
  );

  const rejectAppointment = useCallback(
    async (appointmentId, reasonReject) => {
      return callApi(`/appointment/${appointmentId}/reject`, {
        method: "PUT",
        body: JSON.stringify({ reasonReject }),
      });
    },
    [callApi]
  );

  const historyAppointmentsByUser = useCallback(async () => {
    return callApi(`/appointment/details`);
  }, [callApi]);

  const historyPatientByUser = useCallback(
    async (appointmentId) => {
      return callApi(`/patientDetail/${appointmentId}`);
    },
    [callApi]
  );
  const updatePatientByStaff = useCallback(
    async (appointmentId, description, status) => {
      return callApi(`/patientDetail/${appointmentId}/update`, {
        method: "PUT",
        body: JSON.stringify({ description, status }),
      });
    },
    [callApi]
  );

  const cancelAppointmentByUser = useCallback(
    async (appointmentId) => {
      return callApi(`/appointment/${appointmentId}/cancelByMember`, {
        method: "PUT",
      });
    },
    [callApi]
  );

  const getEmergencyRequestList = useCallback(async () => {
    return callApi("/getEmergencyRequestList");
  }, [callApi]);

  const getProfileER = useCallback(
    async (userId) => {
      return callApi(`/getProfileER/${userId}`);
    },
    [callApi]
  );

  const getPotentialDonorPlus = useCallback(
    async (emergencyId) => {
      return callApi(`/getPotentialDonorPlus/${emergencyId}`);
    },
    [callApi]
  );

  const sendEmergencyEmail = useCallback(
    async (donorEmail, donorName) => {
      return callApi(`/sendEmergencyEmail/${donorEmail}/${donorName}`, {
        method: "POST",
      });
    },
    [callApi]
  );

  // BLOG APIs (public - no auth required)
  const fetchBlogs = useCallback(async () => {
    const res = await callPublicApi("/blogs");
    return Array.isArray(res.data)
      ? res.data
      : res.data.blogs || res.data.data || [];
  }, [callPublicApi]);

  const createBlog = useCallback(
    async (blog) => {
      return callApi("/blogs/create", {
        method: "POST",
        body: JSON.stringify(blog),
      });
    },
    [callApi]
  );

  const updateBlog = useCallback(
    async (id, blog) => {
      return callApi(`/blogs/${id}`, {
        method: "PUT",
        body: JSON.stringify(blog),
      });
    },
    [callApi]
  );

  const addDonorToEmergency = useCallback(
    async (emergencyId, potentialId) => {
      return callApi(`/updateEmergencyRequest/${emergencyId}/${potentialId}`, {
        method: "PUT",
      });
    },
    [callApi]
  );

  const deleteBlog = useCallback(
    async (id) => {
      return callApi(`/blogs/${id}`, { method: "DELETE" });
    },
    [callApi]
  );

  // Pagination helper for blogs
  const paginate = useCallback((items, currentPage, perPage) => {
    const totalPages = Math.ceil(items.length / perPage);
    const paged = items.slice(
      (currentPage - 1) * perPage,
      currentPage * perPage
    );
    return { paged, totalPages };
  }, []);

  const handleEmergencyRequest = useCallback(
    async (emergencyId, payload) => {
      return callApi(`/handleEmergencyRequest/${emergencyId}`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
    [callApi]
  );

  const rejectEmergencyRequest = useCallback(
    async (emergencyId, reason_Reject) => {
      return callApi(`/rejectEmergency/${emergencyId}/reject`, {
        method: "PUT",
        body: JSON.stringify({ reason_Reject }),
      });
    },
    [callApi]
  );

  const getInfoEmergencyRequestsByMember = useCallback(async () => {
    return callApi(`/getInfoEmergencyRequestsByMember`);
  }, [callApi]);

  const cancelEmergencyRequestByMember = useCallback(
    async (emergencyId) => {
      return callApi(`/cancelEmergencyByMember/${emergencyId}/cancel`, {
        method: "PUT",
      });
    },
    [callApi]
  );
  const getAllUsers = useCallback(async () => {
    return callApi("/getAllUsers");
  }, [callApi]);

  const banUser = useCallback(
    async (userId) => {
      return callApi(`/bannedUser/${userId}`, {
        method: "PUT",
      });
    },
    [callApi]
  );

  const unbanUser = useCallback(
    async (userId) => {
      return callApi(`/unbanUser/${userId}`, {
        method: "PUT",
      });
    },
    [callApi]
  );

  const createStaffAccount = useCallback(
    async (staffData) => {
      return callApi("/signup/staff", {
        method: "POST",
        body: JSON.stringify(staffData),
      });
    },
    [callApi]
  );

  // Hàm lấy bệnh án cũ nhất của user
  const getLatestPatientDetail = useCallback(
    async (userId) => {
      return callApi(`/patientDetail/latest/${userId}`, {});
    },
    [callApi]
  );

  const getBloodBank = useCallback(async () => {
    return callApi(`/getBloodBank`);
  }, [callApi]);

  const getAllPatientHistoryByMember = useCallback(async () => {
    return callApi("/patientDetail/all");
  }, [callApi]);

  const createReport = useCallback(
    async (reportData) => {
      return callApi("/createReport", {
        method: "POST",
        body: JSON.stringify(reportData),
        headers: { "Content-Type": "application/json" },
      });
    },
    [callApi]
  );

  const getLatestReport = useCallback(async () => {
    return callApi("/getLatestReport");
  }, [callApi]);

  const updateReport = useCallback(
    async (summaryBlood_Id, Report_Detail_ID, reportData) => {
      return callApi(`/updateReport/${summaryBlood_Id}/${Report_Detail_ID}`, {
        method: "PUT",
        body: JSON.stringify(reportData),
        headers: { "Content-Type": "application/json" },
      });
    },
    [callApi]
  );

  const EMAIL_BASE_URL = import.meta.env.VITE_API_URL || "";

  const fetchEmailApi = useCallback(
    async (endpoint, options = {}) => {
      const url = `${EMAIL_BASE_URL}${endpoint}`;
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
          },
          ...options,
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Gửi mail thất bại");
        return data;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [EMAIL_BASE_URL]
  );

  const sendRecoveryReminderEmail = useCallback(
    async (donorEmail, donorName) => {
      return fetchEmailApi(
        `/email/sendRecoveryReminderEmail/${donorEmail}/${donorName}`,
        { method: "POST" }
      );
    },
    [fetchEmailApi]
  );

  const getAllBloodUnit = useCallback(async () => {
    return callApi("/getAllBloodUnit");
  }, [callApi]);

  const createBloodUnit = useCallback(
    async (BloodType_ID, Volume, Expiration_Date) => {
      return callApi("/createBloodUnit", {
        method: "POST",
        body: JSON.stringify({ BloodType_ID, Volume, Expiration_Date }),
        headers: { "Content-Type": "application/json" },
      });
    },
    [callApi]
  );

  const updateBloodUnit = useCallback(
    async (BloodUnit_ID, Status, Expiration_Date) => {
      return callApi(`/updateBloodUnit/${BloodUnit_ID}`, {
        method: "PUT",
        body: JSON.stringify({ Status, Expiration_Date }),
        headers: { "Content-Type": "application/json" },
      });
    },
    [callApi]
  );

  const addPotential = async (userId, note = "") => {
    return callApi(`/potential/${userId}`, {
      method: "POST",
      body: JSON.stringify({ Note: note }),
      headers: { "Content-Type": "application/json" },
    });
  };

  const getApprovedPotentialList = useCallback(async () => {
    return callApi("/potential");
  }, [callApi]);

  const updatePotentialStatus = useCallback(
    async (potentialId, Status) => {
      return callApi(`/potential/${potentialId}/status`, {
        method: "PUT",
        body: JSON.stringify({ Status }),
        headers: { "Content-Type": "application/json" },
      });
    },
    [callApi]
  );

  //Hàm quên mật khẩu (Cognito)
  const forgotPassword = useCallback(
    async (email) => {
      return callAuthApi("/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
    },
    [callAuthApi]
  );

  const resetPassword = useCallback(
    async ({ email, code, newPassword }) => {
      return callAuthApi("/reset-password", {
        method: "POST",
        body: JSON.stringify({ email, code, newPassword }),
      });
    },
    [callAuthApi]
  );

  const getStaffReports = useCallback(async () => {
    return callApi("/getAllReports");
  }, [callApi]);

  return {
    loading,
    error,
    callApi,
    callPublicApi,
    login,
    register,
    logout,
    getCurrentUser,
    getSlotList,
    registerSlot,
    createSlot,
    updateUser,
    getBloodTypes,
    getAppointments,
    isLoggedIn: isLoggedIn(),
    addAppointmentVolume,
    addEmergencyRequest,
    addPatientDetail,
    confirmBloodTypeByStaff,
    updateStatusAppointmentByStaff,
    rejectAppointment,
    historyAppointmentsByUser,
    historyPatientByUser,
    updatePatientByStaff,
    cancelAppointmentByUser,
    getEmergencyRequestList,
    getProfileER,
    getPotentialDonorPlus,
    sendEmergencyEmail,
    addDonorToEmergency,
    // Blog APIs
    fetchBlogs,
    createBlog,
    updateBlog,
    deleteBlog,
    paginate,
    handleEmergencyRequest,
    rejectEmergencyRequest,
    getInfoEmergencyRequestsByMember,
    cancelEmergencyRequestByMember,
    getAllUsers,
    banUser,
    unbanUser,
    createStaffAccount,
    getLatestPatientDetail,
    getBloodBank,
    getAllPatientHistoryByMember,
    createReport,
    getLatestReport,
    updateReport,
    sendRecoveryReminderEmail,
    getAllBloodUnit,
    createBloodUnit,
    updateBloodUnit,
    addPotential,
    getApprovedPotentialList,
    updatePotentialStatus,
    forgotPassword,
    resetPassword,
    getStaffReports,
    confirmEmail,
    callAuthApi,
  };
};

export default useApi;
