import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/blogs/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const blogData = data.data || data.blog || data;
        setBlog(blogData);
        setLoading(false);
      })
      .catch(() => {
        setError("Không thể tải chi tiết bài viết!");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-center py-8">Đang tải chi tiết...</div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;
  if (!blog) return <div className="text-center py-8">Không tìm thấy bài viết</div>;

  // Lấy key ảnh động như bên News
  const imgKey = blog && typeof blog === 'object' ? Object.keys(blog).find(
    k => k.toLowerCase().includes('image') && k.toLowerCase().includes('url')
  ) : null;
  const imgSrc = imgKey ? blog[imgKey] : "";

  // Hàm tối ưu link ảnh Cloudinary cho sắc nét
  const getOptimizedImgSrc = (src) => {
    if (!src) return '';
    if (src.includes('res.cloudinary.com')) {
      return src.replace('/upload/', '/upload/q_auto,f_auto,dpr_2.0/');
    }
    return src;
  };

  // Hàm tự động format nội dung blog đẹp mắt
  function formatContent(text) {
    if (!text) return '';
    return text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line)
      .map(line => {
        // Tiêu đề phụ (dòng kết thúc bằng : hoặc ?)
        if (/[:?]$/.test(line) || line === line.toUpperCase()) {
          return `<p style=\"font-weight:bold; margin-top:1.2em; margin-bottom:0.5em; font-size:1.1em;\">${line}</p>`;
        }
        // Dòng danh sách
        if (/^[-*•]/.test(line)) {
          return `<li>${line.replace(/^[-*•]\s*/, '')}</li>`;
        }
        return `<p style=\"margin-bottom:0.7em;\">${line}</p>`;
      })
      .join('')
      // Bọc các <li> liên tiếp thành <ul>
      .replace(/(<li>.*?<\/li>)+/gs, match => `<ul style=\"list-style:disc inside; margin-left:1.5em; margin-bottom:0.7em;\">${match}</ul>`);
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow mt-10">
      <h1 className="text-4xl font-bold mb-6 text-[#D32F2F] text-center leading-tight">
        {blog.title || blog.Title || blog.blog_title}
      </h1>
      {imgSrc && (
        <img
          src={getOptimizedImgSrc(imgSrc)}
          alt={blog.title || blog.Title || ''}
          className="mb-8 w-full rounded-2xl shadow-lg border-4 border-white object-cover max-h-[450px]"
          style={{ objectPosition: 'center', background: '#f3f4f6' }}
        />
      )}
      <div
        className="prose max-w-none text-lg text-gray-800 leading-relaxed px-2 md:px-6"
        style={{ paddingTop: 8, paddingBottom: 8 }}
        dangerouslySetInnerHTML={{
          __html: formatContent(blog.content || blog.Content || blog.blog_content || '')
        }}
      />
    </div>
  );
};

export default BlogDetail; 