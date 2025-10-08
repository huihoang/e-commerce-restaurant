// ==================== All Import
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Blog = () => {
  // ==================== useState Hook
  const [blog, setBlog] = useState([]);
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  // ==================== To Fetch From API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/blogs`);
        setBlog(res.data);
      } catch (err) {
        console.error("❌ Lỗi khi lấy dữ liệu bài viết", err.message);
      }
    };

    fetchBlogs();
  }, []);

  // ==================== Format Date to dd/mm/yyyy
  const formatDate = (date) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Intl.DateTimeFormat("en-GB", options).format(new Date(date));
  };

  return (
    <>
      {/* ================= Blog Head Part ================= */}
      <section className="container text-center mt-[68px]">
        <h1 className="font-PlayfairD font-normal text-[100px] leading-[96px]">
          Bài viết
        </h1>
        <p className="mt-6 font-DM_sans font-normal text-lg">
          Chúng tôi trân trọng giá trị Việt
          <br /> qua từng món ăn chúng tôi chế biến
        </p>
      </section>

      {/* ================= All Blogs Part ================= */}
      <section className="container mt-[72px] flex flex-wrap justify-center gap-10">
        {/* ================= All Blogs Fetched From Api =================  */}
        {blog.map((items) => (
          <Link
            to={`/blog/${items._id}`}
            key={items._id}
            className="w-[306px] flex flex-col gap-5 border-2 rounded-xl pb-[26px] hover:scale-105 transition duration-800 will-change-transform"
          >
            <img src={items.image} alt={items.title} />
            <ul className="ml-6 font-DM_sans font-medium text-sm">
              {formatDate(items.createdAt)}
            </ul>
            <ul className="px-6 font-DM_sans font-medium text-xl">
              {items.title}
            </ul>
          </Link>
        ))}
      </section>
    </>
  );
};

export default Blog;