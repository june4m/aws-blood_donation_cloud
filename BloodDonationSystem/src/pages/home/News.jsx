import React, { useEffect, useState, useMemo } from "react";
import useApi from "../../hooks/useApi";
import { Link } from 'react-router-dom';

const blogsPerPage = 6;

const News = () => {
  const { fetchBlogs, loading, error, paginate } = useApi();
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchBlogs()
      .then(setBlogs)
      .catch(() => setBlogs([]));
  }, [fetchBlogs]);

  // Sắp xếp theo Update_At giảm dần nếu có, nếu không thì theo Published_At
  const sortedBlogs = useMemo(() => {
    return [...blogs].sort((a, b) => {
      const getDate = (obj) =>
        new Date(obj.Update_At || obj.Pubished_At || 0);
      return getDate(b) - getDate(a);
    });
  }, [blogs]);

  // Phân trang dùng paginate từ useApi
  const { paged: paginatedBlogs, totalPages } = useMemo(() => {
    return paginate(sortedBlogs, currentPage, blogsPerPage);
  }, [sortedBlogs, currentPage, paginate]);

  if (loading) return <div className="text-center py-8">Đang tải tin tức...</div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-[#D32F2F] mb-8 text-center">Tin tức mới nhất</h2>
      {sortedBlogs.length === 0 && <div className="text-center">Chưa có tin tức nào.</div>}
      <div className="grid md:grid-cols-3 gap-6 mb-8 items-stretch">
        {paginatedBlogs.map((blog, idx) => {
          const imgKey = Object.keys(blog).find(
            k => k.toLowerCase().includes('image') && k.toLowerCase().includes('url')
          );
          const imgSrc = imgKey ? blog[imgKey] : "";
          const fallbackImg = "https://via.placeholder.com/400x250?text=No+Image";
          const blogId = blog._id || blog.Blog_ID || blog.blogId || blog.id || idx;
          return (
            <Link to={`/news/${blogId}`} key={blogId} className="block h-full">
              <div
                className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full min-h-[340px] border border-gray-100 hover:shadow-xl transition-shadow duration-200"
              >
                <div className="w-full h-44 bg-gray-100 overflow-hidden flex-shrink-0">
                  <img
                    src={imgSrc || fallbackImg}
                    alt=""
                    className="w-full h-full object-cover object-center rounded-t-lg"
                    style={{ opacity: imgSrc ? 1 : 0.5 }}
                  />
                </div>
                <div className="flex flex-col flex-1 p-4">
                  <h3 className="font-bold text-xl mb-2 text-[#D32F2F] leading-tight line-clamp-2 min-h-[44px]">
                    {blog.Title || blog.title || blog.blog_title}
                  </h3>
                  <div
                    className="text-gray-700 text-base mb-1 line-clamp-2 min-h-[36px]"
                    style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                  >
                    {blog.Content || blog.content || blog.blog_content}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded font-semibold border transition-colors duration-150 ${currentPage === i + 1 ? 'bg-[#D32F2F] text-white border-[#D32F2F]' : 'bg-white text-[#D32F2F] border-gray-300 hover:bg-[#FDE8E8]'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default News;