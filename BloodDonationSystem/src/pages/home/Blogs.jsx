import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";

const PAGE_SIZE = 6;

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function truncate(str, n) {
  return str.length > n ? str.slice(0, n) + "..." : str;
}

export default function Blogs() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBlog, setSelectedBlog] = useState(null);

  const totalPages = Math.ceil(blogList.length / PAGE_SIZE);
  const paginatedBlogs = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return blogList.slice(start, start + PAGE_SIZE);
  }, [currentPage]);

  return (
    <div className="max-w-5xl mx-auto py-8 px-2">
      <h2 className="text-2xl font-bold mb-6 text-[#D32F2F]">Bài viết nổi bật</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedBlogs.map((blog) => (
          <Link
            key={blog.Blog_ID}
            to={`/blogs/${blog.Blog_ID}`}
            className="bg-white rounded shadow hover:shadow-lg transition cursor-pointer block"
          >
            <img
              src={blog.Image_Url}
              alt={blog.Title}
              className="w-full h-40 object-cover rounded-t"
            />
            <div className="p-4">
              <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path fill="#888" d="M12 8a4 4 0 100 8 4 4 0 000-8zm0-6C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path></svg>
                {formatDate(blog.Published_At)}
              </div>
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{blog.Title}</h3>
              <p className="text-gray-600 text-sm line-clamp-3">
                {truncate(blog.Content, 100)}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-8">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Trước
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((n) =>
            totalPages <= 5
              ? true
              : Math.abs(n - currentPage) <= 2 || n === 1 || n === totalPages
          )
          .map((n, idx, arr) => {
            const isEllipsis = idx > 0 && n - arr[idx - 1] > 1;
            return (
              <span key={n} className="flex">
                {isEllipsis && <span className="px-2">…</span>}
                <button
                  onClick={() => setCurrentPage(n)}
                  className={`px-3 py-1 border rounded ${
                    n === currentPage
                      ? "bg-[#D32F2F] text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {n}
                </button>
              </span>
            );
          })}
        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Sau
        </button>
      </div>

      {/* Modal xem chi tiết blog */}
      {selectedBlog && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 relative shadow-lg animate-fade-in">
            <button
              className="absolute top-2 right-2 text-2xl text-gray-500 hover:text-[#D32F2F]"
              onClick={() => setSelectedBlog(null)}
              title="Đóng"
            >
              ×
            </button>
            <img
              src={selectedBlog.Image_Url}
              alt={selectedBlog.Title}
              className="w-full h-52 object-cover rounded mb-4"
            />
            <div className="text-xs text-gray-400 mb-2 flex items-center gap-1">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path fill="#888" d="M12 8a4 4 0 100 8 4 4 0 000-8zm0-6C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path></svg>
              {formatDate(selectedBlog.Published_At)}
            </div>
            <h2 className="text-xl font-bold mb-2">{selectedBlog.Title}</h2>
            <div className="text-gray-700 whitespace-pre-line">{selectedBlog.Content}</div>
          </div>
        </div>
      )}
    </div>
  );
}

