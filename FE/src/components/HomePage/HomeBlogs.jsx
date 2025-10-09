// ==================== All Import ====================
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

// ==================== Helper Functions ====================
const truncateContent = (content) => {
  return content.length > 150 ? content.slice(0, 150) + "..." : content;
};

// ==================== Main Component ====================
const HomeBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  // ==================== Fetch Blogs from API ====================
  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/blogs`);
      setBlogs(res.data);
    } catch (err) {
      console.error("❌ Lỗi khi lấy dữ liệu bài viết:", err.message);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Function to format date to dd/mm/yyyy
  const formatDate = (date) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Intl.DateTimeFormat("en-GB", options).format(new Date(date));
  };

  return (
    <section className="container pt-[120px] py-5">
      {/* ================= Header ================= */}
      <ul className="flex justify-between items-center">
        <h4 className="font-PlayfairD font-medium text-[55px] leading-[60px]">
          Các bài viết
        </h4>

        <Link to="/blog">
          <button className="w-[190px] h-[65px] bg-[#AD343E] text-white rounded-full hover:bg-red-600 transition duration-200">
            Đọc tất cả
          </button>
        </Link>
      </ul>

      {/* ================= Blog List ================= */}
      <ul className="mt-[130px] flex justify-between flex-wrap gap-8">
        {/* -------- First blog item -------- */}
        {blogs.length > 0 && (
          <Link
            to={`/blog/${blogs[0]._id}`}
            key={blogs[0]._id}
            className="w-[836px] rounded-xl border-2 hover:scale-105 transition duration-200 will-change-transform"
          >
            <img
              src={blogs[0].image}
              alt={blogs[0].title}
              className="w-full h-[450px] object-cover rounded-t-xl"
            />
            <ul className="py-12 px-8 flex flex-col gap-[15px]">
              <li className="font-DM_sans font-medium text-base text-[#737865]">
                {formatDate(blogs[0].createdAt)}
              </li>
              <li className="font-DM_sans font-medium text-xl">
                {blogs[0].title}
              </li>
              <li className="font-DM_sans font-normal text-base">
                {truncateContent(blogs[0].content)}
              </li>
            </ul>
          </Link>
        )}

        {/* -------- Other blog items -------- */}
        <div className="w-[640px] flex flex-wrap gap-6">
          {blogs.slice(1, 5).map((item) => (
            <Link
              to={`/blog/${item._id}`}
              key={item._id}
              className="w-[306px] rounded-xl border-2 hover:scale-105 duration-300 will-change-transform"
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-[200px] w-full object-cover rounded-t-xl"
              />
              <ul className="p-[25px]">
                <li className="font-DM_sans font-medium text-sm text-[#737865]">
                  {formatDate(item.createdAt)}
                </li>
                <li className="mt-3 font-DM_sans font-medium text-xl">
                  {item.title}
                </li>
              </ul>
            </Link>
          ))}
        </div>
      </ul>
    </section>
  );
};

export default HomeBlogs;