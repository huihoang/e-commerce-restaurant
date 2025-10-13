import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminBlogManager = () => {
  // ==================== All useStates
  const [blogItems, setBlogItems] = useState([]);
  const [form, setForm] = useState({
    title: "",
    content: "",
    image: "",
    category: "",
  });
  const [editId, setEditId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  // ==================== Fetch Blog Items from API
  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/blogs`);
      setBlogItems(res.data);
    } catch (err) {
      console.error("❌ Lỗi khi fetch blogs:", err.message);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // ==================== Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // ==================== Submit Form (Add/Edit Blog)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API_BASE_URL}/api/blogs/${editId}`, form);
      } else {
        await axios.post(`${API_BASE_URL}/api/blogs`, form);
      }
      setForm({ title: "", content: "", image: "", category: "" });
      setEditId(null);
      setIsModalOpen(false);
      fetchBlogs();
    } catch (err) {
      console.error("❌ Lỗi khi lưu blog:", err.message);
    }
  };

  // ==================== Handle Edit
  const handleEdit = (item) => {
    setForm({
      title: item.title || "",
      content: item.content || "",
      image: item.image || "",
      category: item.category || "",
    });
    setEditId(item._id);
    setIsModalOpen(true);
  };

  // ==================== Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá bài viết này không?")) {
      try {
        await axios.delete(`${API_BASE_URL}/api/blogs/${id}`);
        fetchBlogs();
      } catch (err) {
        console.error("❌ Lỗi khi xoá bài viết:", err.message);
      }
    }
  };

  // ==================== Handle Modal
  const openModal = () => {
    setForm({ title: "", content: "", image: "", category: "" });
    setEditId(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // ==================== Truncate content to show a preview
  const truncateContent = (content, length = 100) => {
    if (content.length > length) {
      return content.substring(0, length) + "...";
    }
    return content;
  };

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      {/* === Danh sách bài viết === */}
      <div className="mb-6">
        <button
          onClick={openModal}
          className="bg-green-500 text-white px-4 py-2 rounded mb-4"
        >
          Thêm bài viết
        </button>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {blogItems.map((item) => (
            <div
              key={item._id}
              className="border p-4 rounded-lg shadow-lg flex flex-col"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-40 object-cover mb-2 rounded"
              />
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="mb-1">{truncateContent(item.content)}</p>
              <p className="italic text-gray-600 mb-4">
                Danh mục: {item.category}
              </p>

              {/* Nút sửa và xoá nằm cuối */}
              <div className="mt-auto flex justify-between space-x-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="bg-yellow-400 px-3 py-1 rounded text-white w-full"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="bg-red-500 px-3 py-1 rounded text-white w-full"
                >
                  Xoá
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* === Modal Form Thêm/Sửa Bài Viết === */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-11/12 max-w-2xl">
            <h3 className="text-xl font-semibold mb-4">
              {editId ? "Chỉnh sửa bài viết" : "Thêm bài viết mới"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="title"
                placeholder="Tiêu đề bài viết"
                value={form.title}
                onChange={handleChange}
                className="border p-2 w-full"
              />
              <textarea
                name="content"
                placeholder="Nội dung bài viết"
                value={form.content}
                onChange={handleChange}
                className="border p-2 w-full"
              />
              <input
                name="image"
                placeholder="Link hình ảnh"
                value={form.image}
                onChange={handleChange}
                className="border p-2 w-full"
              />
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="border p-2 w-full"
              >
                <option value="">Chọn danh mục bài viết</option>
                <option value="Blog">Blog</option>
                <option value="Hướng dẫn">Hướng dẫn</option>
                <option value="Tin tức">Tin tức</option>
              </select>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  {editId ? "Cập nhật" : "Thêm bài viết"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlogManager;