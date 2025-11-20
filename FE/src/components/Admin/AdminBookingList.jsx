// ==================== All Import
import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminEditBookingModal from "./AdminEditBookingModal";

// ==================== Component
const AdminBookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingBooking, setEditingBooking] = useState(null);
  const ITEMS_PER_PAGE = 5;
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchAllBookings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/api/admin/bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const sorted = res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setBookings(sorted);
        setCurrentPage(1);
      } catch (err) {
        console.error("❌ Lỗi khi lấy danh sách đặt bàn:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllBookings();
  }, []);

  const handleTogglePaidStatus = async (bookingId, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API_BASE_URL}/api/admin/bookings/${bookingId}/pay`,
        { isPaid: !currentStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, isPaid: !currentStatus } : b
        )
      );
    } catch (err) {
      console.error("❌ Lỗi cập nhật trạng thái thanh toán:", err.message);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá đơn đặt bàn này không?"))
      return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/api/admin/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
    } catch (err) {
      console.error("❌ Lỗi khi xoá đặt bàn:", err.message);
    }
  };

  // ==================== Cập nhật thông tin khi lưu thay đổi trong modal
  const handleSaveUpdatedBooking = (updatedBooking) => {
    // Tính toán lại tổng tiền của booking sau khi sửa đổi món ăn hoặc số lượng
    const updatedBookingWithTotal = {
      ...updatedBooking,
      totalAmount: updatedBooking.selectedDishes.reduce(
        (total, dishItem) => total + dishItem.dishId.price * dishItem.quantity,
        0
      ),
    };

    setBookings((prev) =>
      prev.map(
        (b) =>
          b._id === updatedBookingWithTotal._id ? updatedBookingWithTotal : b // Cập nhật chính xác thông tin đã chỉnh sửa
      )
    );
    setEditingBooking(null); // Đóng modal sau khi cập nhật
  };

  const totalPages = Math.max(1, Math.ceil(bookings.length / ITEMS_PER_PAGE));
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedBookings = bookings.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  const pageStart = bookings.length === 0 ? 0 : startIdx + 1;
  const pageEnd = Math.min(startIdx + displayedBookings.length, bookings.length);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const getVisiblePages = () => {
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, idx) => idx + 1);
    }

    const pages = [1];
    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    if (start > 2) {
      pages.push("left-ellipsis");
    }

    for (let i = start; i <= end; i += 1) {
      pages.push(i);
    }

    if (end < totalPages - 1) {
      pages.push("right-ellipsis");
    }

    pages.push(totalPages);
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="max-w-6xl mx-auto p-6">
      {loading ? (
        <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
      ) : bookings.length === 0 ? (
        <p className="text-center text-gray-500">Không có đơn đặt bàn nào.</p>
      ) : (
        displayedBookings.map((booking) => (
          <div
            key={booking._id}
            className="relative bg-white rounded-lg shadow p-4 mb-4 border border-gray-200"
          >
            {/* ==================== Nút chỉnh sửa + xoá (góc phải) */}
            {!booking.isPaid && (
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => setEditingBooking(booking)}
                  className="bg-yellow-500 text-white py-2 px-4 rounded cursor-pointer hover:bg-yellow-600 mr-2"
                >
                  Chỉnh sửa
                </button>
                <button
                  onClick={() => handleDeleteBooking(booking._id)}
                  className="bg-red-500 text-white py-2 px-4 rounded cursor-pointer hover:bg-red-600"
                >
                  Xoá
                </button>
              </div>
            )}

            {/* ==================== Nội dung đặt bàn */}
            <p className="text-gray-700">
              👤 Người đặt: {booking.name || "Người dùng không rõ"}
            </p>
            <p className="text-gray-700">
              📅 {new Date(booking.date).toLocaleDateString("vi-VN")} - ⏰{" "}
              {booking.time}
            </p>
            <p className="text-gray-700">📞 SĐT: {booking.phone}</p>
            <p className="text-gray-700">👥 Số người: {booking.people}</p>
            <p className="text-gray-700">📝 Ghi chú: {booking.note}</p>

            <p
              className={`font-medium ${booking.isPaid ? "text-green-700" : "text-red-600"
                }`}
            >
              {booking.isPaid ? "✅ Đã thanh toán" : "❌ Chưa thanh toán"}
            </p>

            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {booking.selectedDishes?.map((dishItem, index) => (
                <div
                  key={index}
                  className="text-center p-2 border rounded bg-gray-50"
                >
                  <img
                    src={
                      dishItem.dishId?.image || "https://via.placeholder.com/80"
                    }
                    alt={dishItem.dishId?.name || "Món ăn"}
                    className="w-16 h-16 object-cover rounded-full mx-auto"
                  />
                  <p className="text-sm font-medium mt-1">
                    {dishItem.dishId?.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    SL: {dishItem.quantity}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-4 font-semibold text-lg text-green-700">
              💰 Tổng tiền: {booking.totalAmount.toLocaleString("vi-VN")} đ
            </p>

            {/* ==================== Nút thanh toán */}
            <button
              onClick={() =>
                handleTogglePaidStatus(booking._id, booking.isPaid)
              }
              className={`mt-3 px-4 py-2 rounded text-white ${booking.isPaid
                ? "bg-gray-500 hover:bg-gray-600"
                : "bg-green-600 hover:bg-green-700"
                }`}
            >
              {booking.isPaid
                ? "↩️ Đánh dấu chưa thanh toán"
                : "✅ Đánh dấu đã thanh toán"}
            </button>
          </div>
        ))
      )}

      {bookings.length > 0 && (
        <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white/80 px-6 py-5 shadow-sm backdrop-blur">
          <div className="text-sm font-medium text-slate-600">
            Hiển thị <span className="text-slate-900">{pageStart}</span>–
            <span className="text-slate-900">{pageEnd}</span> /{" "}
            <span className="font-semibold">{bookings.length}</span> đơn
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-amber-400 hover:text-amber-600 disabled:cursor-not-allowed disabled:border-slate-100 disabled:text-slate-300"
              disabled={currentPage === 1}
            >
              ← Trước
            </button>
            <div className="flex items-center gap-1 rounded-full bg-slate-100/60 px-2 py-1">
              {visiblePages.map((page, idx) =>
                typeof page === "string" ? (
                  <span
                    key={`${page}-${idx}`}
                    className="px-2 text-sm text-slate-400"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`h-10 w-10 rounded-full text-sm font-semibold transition ${
                      page === currentPage
                        ? "bg-amber-500 text-white shadow-lg shadow-amber-200"
                        : "text-slate-600 hover:bg-white hover:shadow-sm"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className="flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-amber-400 hover:text-amber-600 disabled:cursor-not-allowed disabled:border-slate-100 disabled:text-slate-300"
              disabled={currentPage === totalPages}
            >
              Sau →
            </button>
          </div>
          <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Trang {currentPage} / {totalPages}
          </span>
        </div>
      )}

      {/* ==================== Modal chỉnh sửa */}
      {editingBooking && (
        <AdminEditBookingModal
          booking={editingBooking}
          onClose={() => setEditingBooking(null)}
          onSave={handleSaveUpdatedBooking} // Truyền hàm cập nhật
        />
      )}
    </div>
  );
};

export default AdminBookingList;