// ==================== All Import
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const BlogDetails = () => {
  // ==================== All Hooks
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [related, setRelated] = useState([]);
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

  // ==================== Fetch Related Blogs
  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/blogs`);
        if (Array.isArray(res.data)) {
          const items = res.data.filter((b) => b._id !== id).slice(0, 4);
          setRelated(items);
        }
      } catch (err) {
        console.error("❌ Lỗi khi lấy bài viết liên quan:", err.message);
      }
    };
    fetchRelated();
  }, [API_BASE_URL, id]);
  // ==================== Format Date to dd/mm/yyyy
  const formatDate = (date) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Intl.DateTimeFormat("en-GB", options).format(new Date(date));
  };

  // ==================== Loading
  if (!blog) return <div className="p-10">Đang tải dữ liệu bài viết...</div>;

  // ==================== Render UI
  return (
    <div className="bg-white max-w-7xl mx-auto shadow-sm">
      <section className="px-6 sm:px-8 lg:px-12 pt-16 pb-16">
      <h1 className="text-4xl font-bold mb-4 leading-normal">{blog.title}</h1>
      <p className="text-gray-500 mb-4">{formatDate(blog.createdAt)}</p>
      <div className="w-full mb-6 overflow-hidden rounded-lg">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
        />
      </div>
      <p className="text-lg leading-relaxed whitespace-pre-line">
        {blog.content}
      </p>
      </section>

      {/* ================= Related Blogs ================= */}
      <section className="px-6 sm:px-8 lg:px-12 pb-16">
        <h3 className="font-PlayfairD font-medium text-2xl">Bài viết liên quan</h3>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {related.map((item) => (
            <Link
              to={`/blog/${item._id}`}
              key={item._id}
              className="rounded-xl border-2 border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 bg-white overflow-hidden"
            >
              <div className="h-[160px] w-full overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <p className="font-DM_sans font-medium text-sm text-[#737865]">
                  {formatDate(item.createdAt)}
                </p>
                <h5 className="mt-2 font-DM_sans font-medium text-base">
                  {item.title}
                </h5>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BlogDetails;