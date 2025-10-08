// ==================== All Import
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const BlogDetails = () => {
  // ==================== All Hooks
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  // ==================== Fetch Blog by ID
  const fetchBlog = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/blogs/${id}`);
      setBlog(res.data);
    } catch (err) {
      console.error("❌ Lỗi khi lấy chi tiết bài viết:", err.message);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [id]);

  // ==================== Format Date to dd/mm/yyyy
  const formatDate = (date) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Intl.DateTimeFormat("en-GB", options).format(new Date(date));
  };

  // ==================== Loading
  if (!blog) return <div className="p-10">Đang tải dữ liệu bài viết...</div>;

  // ==================== Render UI
  return (
    <section className="container pt-[120px] pb-[60px]">
      <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
      <p className="text-gray-500 mb-4">{formatDate(blog.createdAt)}</p>
      <img
        src={blog.image}
        alt={blog.title}
        className="w-full mb-6 rounded-lg"
      />
      <p className="text-lg leading-relaxed whitespace-pre-line">
        {blog.content}
      </p>
    </section>
  );
};

export default BlogDetails;