// ==================== All Import
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import AdminEditBookingModal from "./AdminEditBookingModal";
import BookingDetail from "../User/BookingDetail";
import Pagination from "@/components/common/Pagination";
import HeroStatsCard from "../User/BookingHistory/HeroStatsCard";
import BookingTabs from "../User/BookingHistory/BookingTabs";
import BookingFilters from "../User/BookingHistory/BookingFilters";
import BookingHistoryList from "../User/BookingHistory/BookingHistoryList";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useNotification } from "@/contexts/NotificationContext";

// ==================== Component
const AdminBookingList = () => {
  const { showSuccess, showError } = useNotification();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingBooking, setEditingBooking] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dine-in");
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    bookingId: null,
  });
  const ITEMS_PER_PAGE = 8;
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const normalizeBooking = (booking) => {
    const derivedOrderType =
      booking.orderType || (booking.ship?.isShip ? "takeaway" : "dine-in");
    const normalizedTableNumber =
      booking.tableId?.number?.toString() || booking.tableNumber || "";
    return {
      ...booking,
      orderType: derivedOrderType,
      discount: booking.discount || 0,
      tableNumber: normalizedTableNumber,
      deliveryAddress:
        booking.deliveryAddress || booking.ship?.address || booking.note || "",
    };
  };

  const fetchAllBookings = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/api/admin/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sorted = res.data
        .map(normalizeBooking)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setBookings(sorted);
    } catch (err) {
      console.error("❌ Lỗi khi lấy danh sách đặt bàn:", err.message);
      showError("Lỗi khi tải danh sách đặt bàn!");
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, showError]);

  useEffect(() => {
    fetchAllBookings();
  }, [fetchAllBookings]);

  const handleTogglePaidStatus = async (bookingId, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      const nextStatus = !currentStatus;
      await axios.patch(
        `${API_BASE_URL}/api/admin/bookings/${bookingId}/pay`,
        { isPaid: nextStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId
            ? {
                ...b,
                payment: {
                  ...b.payment,
                  isPaid: nextStatus,
                  paidAt: nextStatus ? new Date().toISOString() : null,
                },
              }
            : b
        )
      );
      showSuccess(
        nextStatus
          ? "Đã cập nhật trạng thái thanh toán thành công!"
          : "Đã hủy trạng thái thanh toán!"
      );
    } catch (err) {
      console.error("❌ Lỗi cập nhật trạng thái thanh toán:", err.message);
      showError("Lỗi khi cập nhật trạng thái thanh toán!");
    }
  };

  const handleDeleteBooking = async (bookingId) => {
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

  const openDeleteModal = (bookingId) => {
    setConfirmModal({ open: true, bookingId });
  };

  const closeDeleteModal = () => {
    setConfirmModal({ open: false, bookingId: null });
  };

  const confirmDeleteBooking = async () => {
    if (!confirmModal.bookingId) return;
    await handleDeleteBooking(confirmModal.bookingId);
    closeDeleteModal();
  };

  const handleSaveUpdatedBooking = (updatedBooking) => {
    const subtotal = updatedBooking.selectedDishes.reduce((total, dishItem) => {
      const price = Number(dishItem.dishId?.price ?? 0);
      return total + price * (dishItem.quantity || 0);
    }, 0);
    const discountPercent = Number(updatedBooking.discount || 0);
    const totalAmount = Math.max(
      0,
      subtotal - (subtotal * discountPercent) / 100
    );
    const updatedBookingWithTotal = {
      ...updatedBooking,
      totalAmount,
    };

    const normalized = normalizeBooking(updatedBookingWithTotal);

    setBookings((prev) =>
      prev.map((b) => (b._id === normalized._id ? normalized : b))
    );
    setEditingBooking(null);
  };

  const handleEditBooking = (booking) => {
    setEditingBooking(booking);
  };

  const handleViewDetail = (booking) => {
    setSelectedBooking(booking);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailModalOpen(false);
    setSelectedBooking(null);
  };

  const handlePayment = (booking) => {
    // Admin có thể toggle paid status trực tiếp
    handleTogglePaidStatus(booking._id, booking.payment?.isPaid || false);
  };

  const calculateTotalAmount = (selectedDishes, discount = 0) => {
    const subtotal = selectedDishes.reduce((total, dishItem) => {
      const price = Number(dishItem.dishId?.price) || 0;
      const quantity = Number(dishItem.quantity) || 0;
      return total + price * quantity;
    }, 0);
    return {
      subtotal,
      total: subtotal - (subtotal * discount) / 100,
    };
  };

  const tabFilteredBookings = useMemo(() => {
    return bookings.filter(
      (b) => (b.orderType || "dine-in") === activeTab
    );
  }, [bookings, activeTab]);

  const filteredAndSortedBookings = useMemo(() => {
    let result = [...tabFilteredBookings];

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (b) =>
          b.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.phone?.includes(searchTerm) ||
          b.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.note?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by payment status
    if (paymentFilter !== "all") {
      result = result.filter(
        (b) => (b.payment?.isPaid || false) === (paymentFilter === "paid")
      );
    }

    // Sort
    if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "oldest") {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === "amount-high") {
      result.sort((a, b) => (b.totalAmount || 0) - (a.totalAmount || 0));
    } else if (sortBy === "amount-low") {
      result.sort((a, b) => (a.totalAmount || 0) - (b.totalAmount || 0));
    }

    return result;
  }, [tabFilteredBookings, searchTerm, paymentFilter, sortBy]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAndSortedBookings.length / ITEMS_PER_PAGE)
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, paymentFilter, sortBy, activeTab]);

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
    const paid = bookings.filter((b) => b.payment?.isPaid).length;
    const unpaid = total - paid;
    const totalRevenue = bookings
      .filter((b) => b.payment?.isPaid)
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    return { total, paid, unpaid, totalSpent: totalRevenue };
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

  const formatPrice = (price) => {
    if (!price) return "0 đ";
    return Number(price).toLocaleString("vi-VN") + " đ";
  };

  return (
    <div>
      <HeroStatsCard 
        stats={stats} 
        onRefresh={fetchAllBookings}
        title="📋 Lịch Sử Đặt Bàn"
        gradient="from-indigo-500 via-purple-500 to-pink-500"
      />

      <BookingTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <BookingFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        paymentFilter={paymentFilter}
        onPaymentFilterChange={setPaymentFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        paymentFilterOptions={paymentFilterOptions}
        sortOptions={sortOptions}
      />

      <BookingHistoryList
        bookings={paginatedBookings}
        loading={loading}
        activeTab={activeTab}
        searchTerm={searchTerm}
        paymentFilter={paymentFilter}
        calculateTotalAmount={calculateTotalAmount}
        formatPrice={formatPrice}
        onViewDetail={handleViewDetail}
        onEdit={handleEditBooking}
        onDelete={openDeleteModal}
        onPayment={handlePayment}
        isAdmin={true}
      />

      {filteredAndSortedBookings.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          className="mt-6"
        />
      )}

      {/* ==================== Modals ==================== */}
      {editingBooking && (
        <AdminEditBookingModal
          booking={editingBooking}
          onClose={() => setEditingBooking(null)}
          onSave={handleSaveUpdatedBooking}
        />
      )}

      {isDetailModalOpen && selectedBooking && (
        <BookingDetail
          booking={selectedBooking}
          onClose={handleCloseDetail}
        />
      )}

      <ConfirmModal
        open={confirmModal.open}
        title="Xóa đơn đặt bàn"
        message="Bạn có chắc chắn muốn xoá đơn đặt bàn này? Hành động này không thể hoàn tác."
        confirmLabel="Xóa"
        cancelLabel="Huỷ"
        onConfirm={confirmDeleteBooking}
        onCancel={closeDeleteModal}
      />
    </div>
  );
};

export default AdminBookingList;
