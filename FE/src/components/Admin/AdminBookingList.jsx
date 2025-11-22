// ==================== All Import
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import AdminEditBookingModal from "./AdminEditBookingModal";
import Pagination from "@/components/common/Pagination";
import DropdownSelect from "@/components/common/DropdownSelect";
import { useNotification } from "@/contexts/NotificationContext";

// ==================== Component
const AdminBookingList = () => {
  const { showSuccess, showError } = useNotification();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingBooking, setEditingBooking] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const ITEMS_PER_PAGE = 6;
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const fetchAllBookings = useCallback(async () => {
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
      } catch (err) {
        console.error("❌ Lỗi khi lấy danh sách đặt bàn:", err.message);
      } finally {
        setLoading(false);
      }
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchAllBookings();
  }, [fetchAllBookings]);

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
      showSuccess(
        !currentStatus
          ? "Đã cập nhật trạng thái thanh toán thành công!"
          : "Đã hủy trạng thái thanh toán!"
      );
    } catch (err) {
      console.error("❌ Lỗi cập nhật trạng thái thanh toán:", err.message);
      showError("Lỗi khi cập nhật trạng thái thanh toán!");
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (
      !globalThis.confirm("Bạn có chắc chắn muốn xoá đơn đặt bàn này không?")
    )
      return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/api/admin/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showSuccess("Xóa đơn đặt bàn thành công!");
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
    } catch (err) {
      console.error("❌ Lỗi khi xoá đặt bàn:", err.message);
      showError("Lỗi khi xóa đơn đặt bàn!");
    }
  };

  const handleSaveUpdatedBooking = (updatedBooking) => {
    const updatedBookingWithTotal = {
      ...updatedBooking,
      totalAmount: updatedBooking.selectedDishes.reduce(
        (total, dishItem) =>
          total + dishItem.dishId.price * dishItem.quantity,
        0
      ),
    };

    setBookings((prev) =>
      prev.map(
        (b) =>
          b._id === updatedBookingWithTotal._id
            ? updatedBookingWithTotal
            : b
      )
    );
    setEditingBooking(null);
  };

  const filteredAndSortedBookings = useMemo(() => {
    let result = [...bookings];

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (b) =>
          b.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.phone?.includes(searchTerm) ||
          b.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by payment status
    if (paymentFilter !== "all") {
      result = result.filter(
        (b) => b.isPaid === (paymentFilter === "paid")
      );
    }

    // Sort
    if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "oldest") {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === "amount-high") {
      result.sort((a, b) => b.totalAmount - a.totalAmount);
    } else if (sortBy === "amount-low") {
      result.sort((a, b) => a.totalAmount - b.totalAmount);
    }

    return result;
  }, [bookings, searchTerm, paymentFilter, sortBy]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAndSortedBookings.length / ITEMS_PER_PAGE)
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, paymentFilter, sortBy]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedBookings.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSortedBookings, currentPage]);

  const stats = useMemo(() => {
    const total = bookings.length;
    const paid = bookings.filter((b) => b.isPaid).length;
    const unpaid = total - paid;
    const totalRevenue = bookings
      .filter((b) => b.isPaid)
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    return { total, paid, unpaid, totalRevenue };
  }, [bookings]);

  const paymentFilterOptions = [
    { label: "Tất cả", value: "all" },
    { label: "Đã thanh toán", value: "paid" },
    { label: "Chưa thanh toán", value: "unpaid" },
  ];

  const sortOptions = [
    { label: "Mới nhất", value: "newest" },
    { label: "Cũ nhất", value: "oldest" },
    { label: "Giá cao → thấp", value: "amount-high" },
    { label: "Giá thấp → cao", value: "amount-low" },
  ];

  return (
    <div>
      {/* ==================== Hero Stats Card ==================== */}
      <div className="mb-6 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 text-white shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">📋 Quản Lý Đặt Bàn</h2>
          <button
            onClick={fetchAllBookings}
            className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/30"
          >
            🔄 Làm mới
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-2xl bg-white/20 p-4 backdrop-blur-sm">
            <p className="text-sm opacity-90">Tổng đơn</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="rounded-2xl bg-white/20 p-4 backdrop-blur-sm">
            <p className="text-sm opacity-90">Đã thanh toán</p>
            <p className="text-2xl font-bold text-green-200">{stats.paid}</p>
          </div>
          <div className="rounded-2xl bg-white/20 p-4 backdrop-blur-sm">
            <p className="text-sm opacity-90">Chưa thanh toán</p>
            <p className="text-2xl font-bold text-yellow-200">{stats.unpaid}</p>
          </div>
          <div className="rounded-2xl bg-white/20 p-4 backdrop-blur-sm">
            <p className="text-sm opacity-90">Doanh thu</p>
            <p className="text-2xl font-bold">
              {stats.totalRevenue.toLocaleString("vi-VN")} đ
            </p>
          </div>
        </div>
      </div>

      {/* ==================== Search & Filters ==================== */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm theo tên, SĐT, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-inner transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <div className="w-full md:w-48">
          <DropdownSelect
            options={paymentFilterOptions}
            value={paymentFilter}
            onChange={setPaymentFilter}
            placeholder="Lọc thanh toán"
            className="w-full"
          />
        </div>
        <div className="w-full md:w-48">
          <DropdownSelect
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
            placeholder="Sắp xếp"
            className="w-full"
          />
        </div>
      </div>

      {/* ==================== Booking Cards ==================== */}
      {(() => {
        if (loading) {
          return (
            <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
              <p className="text-slate-500">Đang tải dữ liệu...</p>
            </div>
          );
        }
        if (paginatedBookings.length === 0) {
          const emptyMessage =
            searchTerm || paymentFilter !== "all"
              ? "Không tìm thấy đơn đặt bàn nào."
              : "Chưa có đơn đặt bàn nào.";
          return (
            <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
              <p className="text-slate-500">{emptyMessage}</p>
            </div>
          );
        }
        return (
        <div className="grid gap-4 md:grid-cols-2">
          {paginatedBookings.map((booking) => (
            <div
              key={booking._id}
              className="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg"
            >
              {/* ==================== Status Badge ==================== */}
              <div className="absolute right-4 top-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    booking.isPaid
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {booking.isPaid ? "✅ Đã thanh toán" : "❌ Chưa thanh toán"}
                </span>
              </div>

              {/* ==================== Customer Info ==================== */}
              <div className="mb-4 pr-20">
                <h3 className="mb-2 text-lg font-bold text-slate-900">
                  👤 {booking.name || "Khách hàng"}
                </h3>
                <div className="space-y-1 text-sm text-slate-600">
                  <p>📞 {booking.phone || "N/A"}</p>
                  {booking.email && <p>📧 {booking.email}</p>}
                  <p>
              📅 {new Date(booking.date).toLocaleDateString("vi-VN")} - ⏰{" "}
              {booking.time}
            </p>
                  <p>👥 {booking.people} người</p>
                  {booking.note && (
                    <p className="mt-2 rounded-lg bg-slate-50 p-2 text-xs italic">
                      📝 {booking.note}
                    </p>
                  )}
                </div>
              </div>

              {/* ==================== Dishes Grid ==================== */}
              {booking.selectedDishes && booking.selectedDishes.length > 0 && (
                <div className="mb-4 rounded-xl bg-slate-50 p-3">
                  <p className="mb-2 text-xs font-semibold text-slate-700">
                    🍽️ Món đã chọn:
                  </p>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {booking.selectedDishes.map((dishItem, index) => (
                <div
                  key={index}
                        className="flex flex-col items-center rounded-lg bg-white p-2 shadow-sm"
                >
                  <img
                    src={
                            dishItem.dishId?.image ||
                            "https://via.placeholder.com/60"
                    }
                    alt={dishItem.dishId?.name || "Món ăn"}
                          className="mb-1 h-12 w-12 rounded-full object-cover"
                  />
                        <p className="text-xs font-medium text-slate-700">
                          {dishItem.dishId?.name || "N/A"}
                  </p>
                        <p className="text-xs text-slate-500">
                          x{dishItem.quantity}
                  </p>
                </div>
              ))}
            </div>
                </div>
              )}

              {/* ==================== Total Amount ==================== */}
              <div className="mb-4 flex items-center justify-between rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 p-3">
                <span className="text-sm font-semibold text-slate-700">
                  💰 Tổng tiền:
                </span>
                <span className="text-lg font-bold text-green-700">
                  {booking.totalAmount?.toLocaleString("vi-VN") || 0} đ
                </span>
              </div>

              {/* ==================== Action Buttons ==================== */}
              <div className="flex flex-wrap gap-2">
                {!booking.isPaid && (
                  <>
                    <button
                      onClick={() => setEditingBooking(booking)}
                      className="flex-1 rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
                    >
                      ✏️ Chỉnh sửa
                    </button>
                    <button
                      onClick={() => handleDeleteBooking(booking._id)}
                      className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
                    >
                      🗑️ Xóa
                    </button>
                  </>
                )}
            <button
              onClick={() =>
                handleTogglePaidStatus(booking._id, booking.isPaid)
              }
                  className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold text-white transition ${
                    booking.isPaid
                      ? "bg-slate-500 hover:bg-slate-600"
                : "bg-green-600 hover:bg-green-700"
                }`}
            >
              {booking.isPaid
                ? "↩️ Đánh dấu chưa thanh toán"
                : "✅ Đánh dấu đã thanh toán"}
            </button>
          </div>
            </div>
          ))}
        </div>
        );
      })()}

      {/* ==================== Pagination ==================== */}
      {filteredAndSortedBookings.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          className="mt-6"
        />
      )}

      {/* ==================== Edit Modal ==================== */}
      {editingBooking && (
        <AdminEditBookingModal
          booking={editingBooking}
          onClose={() => setEditingBooking(null)}
          onSave={handleSaveUpdatedBooking}
        />
      )}
    </div>
  );
};

export default AdminBookingList;
