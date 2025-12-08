import React, { useState, useEffect, useRef } from "react";
import useApi from "../../hooks/useApi";
import { toast } from "react-toastify";

const BlogAdmin = () => {
  const {
    fetchBlogs,
    createBlog,
    updateBlog,
    deleteBlog,
    paginate,
    loading,
    error,
  } = useApi();

  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6;
  const [form, setForm] = useState({ title: "", content: "", imageUrl: "" });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchBlogs()
      .then((data) => {
        // Sắp xếp theo Update_At giảm dần nếu có, nếu không thì theo Pubished_At
        const sorted = [...data].sort((a, b) => {
          const getDate = (obj) =>
            new Date(obj.Update_At || obj.Pubished_At || 0);
          return getDate(b) - getDate(a);
        });
        setBlogs(sorted);
      })
      .catch(() => setBlogs([]));
  }, [fetchBlogs]);

  // Validate và submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    // Validate tiêu đề không trùng
    const normalizedTitle = form.title.trim().toLowerCase();
    const isDuplicateTitle = blogs.some((b, idx) => {
      if (editingId && (b.Blog_ID || b.blogId || b.id || idx) === editingId)
        return false;
      return (
        (b.Title || b.title || b.blog_title || "").trim().toLowerCase() ===
        normalizedTitle
      );
    });
    if (!form.title.trim()) {
      setFormError("Vui lòng nhập tiêu đề!");
      return;
    }
    if (isDuplicateTitle) {
      setFormError("Tiêu đề đã tồn tại, vui lòng nhập tiêu đề khác!");
      return;
    }
    if (!form.content.trim()) {
      setFormError("Vui lòng nhập nội dung!");
      return;
    }
    if (form.content.trim().length < 10) {
      setFormError("Nội dung quá ngắn, vui lòng nhập chi tiết hơn!");
      return;
    }
    // Validate link ảnh
    if (!form.imageUrl) {
      setFormError("Vui lòng chọn ảnh hợp lệ!");
      toast.error("Vui lòng chọn ảnh hợp lệ!");
      return;
    }
    const url = form.imageUrl.trim();
    const isValidImg = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(url);
    if (!isValidImg) {
      setFormError(
        "Ảnh không hợp lệ! (phải là link http(s), .jpg, .png, ... từ máy tính)"
      );
      toast.error(
        "Ảnh không hợp lệ! (phải là link http(s), .jpg, .png, ... từ máy tính)"
      );
      return;
    }
    try {
      if (editingId) {
        await updateBlog(editingId, {
          title: form.title,
          content: form.content,
          imageUrl: form.imageUrl,
        });
        toast.success("Cập nhật tin tức thành công!");
      } else {
        await createBlog({
          title: form.title,
          content: form.content,
          imageUrl: form.imageUrl,
        });
        toast.success("Tạo tin tức mới thành công!");
      }
      fetchBlogs().then(setBlogs);
      setShowForm(false); // Đóng popup NGAY khi thành công
      setEditingId(null);
      setForm({ title: "", content: "", imageUrl: "" });
      setFormError("");
    } catch (err) {
      setFormError(err.message || "Có lỗi xảy ra, vui lòng thử lại!");
      toast.error(
        "Không thể lưu ảnh này! Vui lòng chọn ảnh khác hoặc thử lại."
      );
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteBlog(deleteId);
      fetchBlogs().then(setBlogs);
      toast.success("Xóa tin tức thành công!");
    } catch {
      toast.error("Xóa thất bại!");
    }
    setShowConfirmDelete(false);
    setDeleteId(null);
  };

  const handleEdit = (blog) => {
    const imgKey = Object.keys(blog).find(
      (k) =>
        k.toLowerCase().includes("image") && k.toLowerCase().includes("url")
    );
    const imgSrc = imgKey ? blog[imgKey] : "";
    setForm({
      title: blog.Title || blog.title || blog.blog_title || "",
      content: blog.Content || blog.content || blog.blog_content || "",
      imageUrl: imgSrc || "",
    });
    setEditingId(blog.Blog_ID || blog.blogId || blog.id);
    setShowForm(true);
  };

  const handleAdd = () => {
    setForm({ title: "", content: "", imageUrl: "" });
    setEditingId(null);
    setShowForm(true);
  };

  // Pagination
  const { paged, totalPages } = paginate(blogs, currentPage, cardsPerPage);

  // Cloudinary config demo, thay bằng của bạn nếu cần
  const CLOUDINARY_CLOUD_NAME = "dehtgp5iq";
  const CLOUDINARY_UPLOAD_PRESET = "demo_preset"; // Đảm bảo đúng tuyệt đối, không dấu cách, không ký tự lạ

  return (
    <div className="p-4 sm:p-6 max-w-screen-xl mx-auto w-full">
      <h2 className="text-2xl font-bold mb-4 text-[#D32F2F]">
        Quản lý tin tức
      </h2>
      <button
        onClick={handleAdd}
        className="mb-4 px-4 py-2 bg-[#D32F2F] text-white rounded"
      >
        + Thêm tin mới
      </button>
      {loading ? (
        <div>Đang tải...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>
          {showForm && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fadeIn">
              <form
                onSubmit={handleSubmit}
                className="bg-white p-4 sm:p-8 md:p-12 rounded-3xl shadow-2xl w-full max-w-lg sm:max-w-2xl md:max-w-4xl border border-gray-200 animate-scaleIn"
                style={{ minWidth: "0", width: "100%" }}
              >
                <h3 className="text-3xl font-extrabold mb-8 text-center text-[#D32F2F] tracking-wide">
                  {editingId ? "Sửa tin tức" : "Thêm tin tức mới"}
                </h3>
                {formError && (
                  <div className="text-red-500 mb-4 text-center font-semibold">
                    {formError}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mb-8">
                  <div>
                    <label className="block mb-2 font-semibold text-lg">
                      Tiêu đề
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D32F2F] transition shadow-sm text-lg"
                      value={form.title}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, title: e.target.value }))
                      }
                      required
                      placeholder="Nhập tiêu đề bài viết..."
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold text-lg">
                      Ảnh
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        id="customFileInput"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          setUploading(true);
                          const formData = new FormData();
                          formData.append("file", file);
                          formData.append(
                            "upload_preset",
                            CLOUDINARY_UPLOAD_PRESET
                          );
                          try {
                            const res = await fetch(
                              `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                              {
                                method: "POST",
                                body: formData,
                              }
                            );
                            const data = await res.json();
                            if (data.secure_url) {
                              setForm((f) => ({
                                ...f,
                                imageUrl: data.secure_url,
                              }));
                              toast.success("Tải ảnh lên thành công!");
                            } else {
                              toast.error("Tải ảnh lên thất bại!");
                            }
                          } catch {
                            toast.error("Lỗi upload ảnh!");
                          }
                          setUploading(false);
                        }}
                      />
                      <label
                        htmlFor="customFileInput"
                        className="px-5 py-3 bg-gray-200 rounded-xl cursor-pointer hover:bg-gray-300 transition flex items-center gap-2 text-lg font-semibold"
                      >
                        Chọn tệp
                        {uploading && (
                          <span className="animate-spin inline-block w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full"></span>
                        )}
                      </label>
                      <span className="text-gray-500 text-base">
                        {form.imageUrl ? "Đã chọn ảnh" : "Chưa chọn tệp"}
                      </span>
                    </div>
                    {form.imageUrl && (
                      <img
                        src={form.imageUrl}
                        alt="preview"
                        className="mt-3 rounded-xl w-56 h-40 object-cover border shadow"
                      />
                    )}
                  </div>
                </div>
                <div className="mb-8">
                  <label className="block mb-2 font-semibold text-lg">
                    Nội dung
                  </label>
                  <textarea
                    className="w-full border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D32F2F] transition min-h-[180px] shadow-sm text-lg"
                    value={form.content}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, content: e.target.value }))
                    }
                    required
                    placeholder="Nhập nội dung chi tiết..."
                  />
                </div>
                <div className="flex flex-wrap justify-end gap-2 sm:gap-4 mt-8">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-3 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300 transition font-semibold shadow text-lg"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-7 py-3 rounded-xl bg-[#D32F2F] text-white font-bold hover:bg-red-700 transition font-semibold shadow text-lg"
                    disabled={uploading}
                  >
                    Lưu
                  </button>
                </div>
              </form>
            </div>
          )}
          {/* Card grid đẹp hơn */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 p-2 sm:p-4 md:p-6">
            {paged.map((blog, idx) => {
              const imgKey = Object.keys(blog).find(
                (k) =>
                  k.toLowerCase().includes("image") &&
                  k.toLowerCase().includes("url")
              );
              const imgSrc = imgKey ? blog[imgKey] : "";
              const fallbackImg =
                "https://via.placeholder.com/96x64?text=No+Image";
              return (
                <div
                  key={blog.Blog_ID || blog.blogId || blog.id || idx}
                  className="bg-white rounded-2xl shadow-xl p-5 flex flex-col hover:shadow-2xl hover:scale-[1.03] transition-all duration-200 border border-gray-100"
                >
                  <div className="mb-3 w-full h-40 flex items-center justify-center relative overflow-hidden rounded-xl">
                    <img
                      src={imgSrc || fallbackImg}
                      alt=""
                      className="w-full h-40 object-cover rounded-xl hover:scale-105 transition"
                      style={{ opacity: imgSrc ? 1 : 0.5 }}
                    />
                    {!imgSrc && (
                      <span className="absolute inset-0 flex items-center justify-center text-[#D32F2F] text-xs font-bold bg-white/70">
                        Chưa có ảnh
                      </span>
                    )}
                  </div>
                  <div className="font-bold text-xl mb-2 truncate text-[#D32F2F]">
                    {blog.Title || blog.title || blog.blog_title}
                  </div>
                  <div className="text-gray-700 text-sm mb-3 max-h-16 overflow-hidden">
                    {blog.Content || blog.content || blog.blog_content}
                  </div>
                  <div className="mt-auto flex flex-wrap gap-2">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-500 hover:text-white transition font-semibold shadow"
                      title="Sửa"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => {
                        setShowConfirmDelete(true);
                        setDeleteId(
                          blog.Blog_ID || blog.blogId || blog.id || idx
                        );
                      }}
                      className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-500 hover:text-white transition font-semibold shadow"
                      title="Xóa"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-wrap justify-center mt-6 gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === i + 1
                      ? "bg-[#D32F2F] text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
      {/* Modal xác nhận xóa đẹp, hiệu ứng fade/scale */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white p-4 sm:p-8 rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-md flex flex-col items-center animate-scaleIn">
            <div className="text-lg font-bold mb-4 text-center text-[#D32F2F]">
              Bạn có chắc muốn xóa tin này không?
            </div>
            <div className="flex gap-4 mt-2">
              <button
                onClick={handleDelete}
                className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 font-semibold shadow"
              >
                Đồng ý
              </button>
              <button
                onClick={() => {
                  setShowConfirmDelete(false);
                  setDeleteId(null);
                }}
                className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold shadow"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogAdmin;
