import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminUserManager = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [formData, setFormData] = useState({});
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get(`${API_BASE_URL}/api/users`);
    setUsers(res.data);
  };

  const handleEdit = (user) => {
    setEditingUserId(user._id);
    setFormData({
      username: user.username,
      email: user.email,
      role: user.role,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    await axios.put(`${API_BASE_URL}/api/users/${editingUserId}`, formData);
    setEditingUserId(null);
    fetchUsers();
  };

  const handleDelete = async (id) => {
    if (confirm("Xác nhận xóa user này?")) {
      await axios.delete(`${API_BASE_URL}/api/users/${id}`);
      fetchUsers();
    }
  };

  return (
    <div className="p-4 md:p-6">
      <table className="w-full table-auto border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1 text-sm md:text-base">
              Tên đăng nhập
            </th>
            <th className="border px-2 py-1 text-sm md:text-base">Email</th>
            <th className="border px-2 py-1 text-sm md:text-base">Vai trò</th>
            <th className="border px-2 py-1 text-sm md:text-base">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="text-center">
              <td className="border px-2 py-1">
                {editingUserId === user._id ? (
                  <input
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="border p-1 w-full"
                  />
                ) : (
                  user.username
                )}
              </td>
              <td className="border px-2 py-1">
                {editingUserId === user._id ? (
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="border p-1 w-full"
                  />
                ) : (
                  user.email
                )}
              </td>
              <td className="border px-2 py-1">
                {editingUserId === user._id ? (
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="border p-1 w-full"
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                ) : (
                  user.role
                )}
              </td>
              <td className="border px-2 py-1 space-x-2">
                {editingUserId === user._id ? (
                  <>
                    <button
                      onClick={handleUpdate}
                      className="text-green-600 text-sm md:text-base"
                    >
                      Lưu
                    </button>
                    <button
                      onClick={() => setEditingUserId(null)}
                      className="text-gray-500 text-sm md:text-base"
                    >
                      Hủy
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-blue-600 text-sm md:text-base"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-red-600 text-sm md:text-base"
                    >
                      Xóa
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserManager;