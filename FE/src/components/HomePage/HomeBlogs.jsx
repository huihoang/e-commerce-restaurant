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
    <section className="px-6 sm:px-8 lg:px-12 pt-16 pb-16 bg-white">
      {/* ================= Header ================= */}
      <div className="flex justify-between items-center">
        <h4 className="font-PlayfairD font-medium text-3xl sm:text-4xl lg:text-[55px] leading-[1.3]">
          Các bài viết
        </h4>

        <Link to="/blog">
          <button className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold">
            Đọc tất cả
          </button>
        </Link>
      </div>

      {/* ================= Blog List ================= */}
      <div className="mt-12 flex flex-col lg:grid lg:grid-cols-2 gap-8 items-start">
        {/* -------- Left side: First blog item (50%) -------- */}
        {blogs.length > 0 && (
          <Link
            to={`/blog/${blogs[0]._id}`}
            key={blogs[0]._id}
            className="rounded-xl border-2 border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 bg-white overflow-hidden"
          >
            <div className="w-full h-[450px] overflow-hidden rounded-t-xl">
              <img
                src={blogs[0].image}
                alt={blogs[0].title}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="py-12 px-8 flex flex-col gap-[15px]">
              <p className="font-DM_sans font-medium text-base text-[#737865]">
                {formatDate(blogs[0].createdAt)}
              </p>
              <h5 className="font-DM_sans font-medium text-xl">
                {blogs[0].title}
              </h5>
              <p className="font-DM_sans font-normal text-base">
                {truncateContent(blogs[0].content)}
              </p>
            </div>
          </Link>
        )}

        {/* -------- Right side: 4 blog items (50%) -------- */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 items-start">
          {blogs.slice(1, 5).map((item) => (
            <Link
              to={`/blog/${item._id}`}
              key={item._id}
              className="rounded-xl border-2 border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 bg-white overflow-hidden self-start w-full"
            >
              <div className="h-[200px] w-full overflow-hidden rounded-t-xl">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-[25px]">
                <p className="font-DM_sans font-medium text-sm text-[#737865]">
                  {formatDate(item.createdAt)}
                </p>
                <h5 className="mt-3 font-DM_sans font-medium text-xl">
                  {item.title}
                </h5>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeBlogs;