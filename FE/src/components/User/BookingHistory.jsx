import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import EditBookingModal from "./EditBookingModal";
import PaymentModal from "./PaymentModal";
import BookingDetail from "./BookingDetail";
import Pagination from "@/components/common/Pagination";
import BookingTabs from "./BookingHistory/BookingTabs";
import BookingFilters from "./BookingHistory/BookingFilters";
import BookingHistoryList from "./BookingHistory/BookingHistoryList";
import HeroStatsCard from "./BookingHistory/HeroStatsCard";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useNotification } from "@/contexts/NotificationContext";

const BookingHistory = () => {
  const { showSuccess, showError } = useNotification();
  const role = localStorage.getItem("role") || "user";
  const isStaffOrAdmin = role === "staff" || role === "admin";
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dine-in");
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [sortBy, setSortBy] = useState("none");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    bookingId: null,
  });
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const normalizeBooking = (booking) => {
    const derivedOrderType =
      booking.orderType || (booking.ship?.isShip ? "takeaway" : "dine-in");
    const normalizedTableNumber =
      booking.tableId?.number?.toString() || booking.tableNumber || "";
    const tableLocation = booking.tableId?.location || booking.tableLocation || "";
    return {
      ...booking,
      orderType: derivedOrderType,
      discount: booking.discount || 0,
      tableNumber: normalizedTableNumber,
      tableLocation,
      deliveryAddress:
        booking.deliveryAddress || booking.ship?.address || booking.note || "",
    };
  };

  const fetchBookings = useCallback(async () => {
      try {
      setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/api/bookings/history`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const normalized = res.data.map(normalizeBooking);
      setBookings(normalized);
      } catch (err) {
        console.error("❌ Lỗi khi lấy lịch sử đặt bàn:", err.message);
    } finally {
      setLoading(false);
      }
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const calculateTotalAmount = (booking) => {
    const selectedDishes = booking.selectedDishes || [];
    const discount = Number(booking.discount || 0);
    const storedTotal = Number(booking.totalAmount || 0);

    // Tính tổng tiền với giảm giá của từng món
    let originalSubtotal = 0;
    let itemDiscountAmount = 0;
    const subtotal = selectedDishes.reduce((total, dishItem) => {
      const price = Number(dishItem.dishId?.price) || 0;
      const quantity = Number(dishItem.quantity) || 0;
      const discountPercent = Number(dishItem.dishId?.discountPercent) || 0;
      
      const originalPrice = price * quantity;
      originalSubtotal += originalPrice;
      
      const discountedPrice = price * (1 - discountPercent / 100);
      const finalPrice = discountedPrice * quantity;
      
      if (discountPercent > 0) {
        itemDiscountAmount += originalPrice - finalPrice;
      }
      
      return total + finalPrice;
    }, 0);
    
    // Nếu không có món ăn (chỉ đặt bàn) thì hiển thị tổng đã lưu
    if (selectedDishes.length === 0) {
      return {
        originalSubtotal: storedTotal,
        itemDiscountAmount: 0,
        subtotal: storedTotal,
        discountCodeAmount: 0,
        total: storedTotal,
      };
    }
    
    // Áp dụng mã giảm giá (nếu có)
    const discountCodeAmount = (subtotal * discount) / 100;
    const total = Math.max(0, subtotal - discountCodeAmount);
    
    return {
      originalSubtotal,
      itemDiscountAmount,
      subtotal,
      discountCodeAmount,
      total,
    };
  };

  const handleEditBooking = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  const handleSaveBooking = (updatedBooking) => {
    const amounts = calculateTotalAmount(updatedBooking);
    updatedBooking.totalAmount = amounts.total;

    const normalized = normalizeBooking(updatedBooking);

    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking._id === normalized._id ? normalized : booking
      )
    );
    handleCloseModal();
  };

  const handleDeleteBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/api/bookings/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking._id !== bookingId)
      );
      showSuccess("Đã xóa đặt bàn thành công!");
    } catch (err) {
      console.error("❌ Lỗi khi xóa đặt bàn:", err.message);
      showError("Lỗi khi xóa đặt bàn!");
    }
  };

  const openDeleteModal = (bookingId) => {
    setConfirmModal({ open: true, bookingId });
  };

  const closeDeleteModal = () => {
    setConfirmModal({ open: false, bookingId: null });
  };

  const confirmDelete = async () => {
    if (!confirmModal.bookingId) return;
    await handleDeleteBooking(confirmModal.bookingId);
    closeDeleteModal();
  };

  const handleOpenPaymentModal = (booking) => {
    setSelectedBooking(booking);
    setIsPaymentModalOpen(true);
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedBooking(null);
  };

  const handlePaymentSuccess = async () => {
    await fetchBookings();
    handleClosePaymentModal();
  };

  const handleViewDetail = (booking) => {
    setSelectedBooking(booking);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailModalOpen(false);
    setSelectedBooking(null);
  };

  const tabFilteredBookings = useMemo(() => {
    return bookings.filter(
      (b) => (b.orderType || "dine-in") === activeTab
    );
  }, [bookings, activeTab]);

  const filteredAndSortedBookings = useMemo(() => {
    let result = [...tabFilteredBookings];

    if (searchTerm) {
      result = result.filter(
        (b) =>
          b.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.phone?.includes(searchTerm) ||
          b.note?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (paymentFilter !== "all") {
      result = result.filter((b) => {
        const isPaid = b.payment?.isPaid || false;
        return isPaid === (paymentFilter === "paid");
      });
    }

    const toDateTime = (b) =>
      new Date(`${b.date || b.createdAt || ""}T${b.time || "00:00"}`);

    if (sortBy === "unpaid-latest") {
      result.sort((a, b) => {
        const aPaid = a.payment?.isPaid || false;
        const bPaid = b.payment?.isPaid || false;
        if (aPaid !== bPaid) return aPaid ? 1 : -1; // unpaid first
        return toDateTime(b) - toDateTime(a); // newest time first
      });
    } else if (sortBy === "newest") {
      result.sort((a, b) => toDateTime(b) - toDateTime(a));
    } else if (sortBy === "oldest") {
      result.sort((a, b) => toDateTime(a) - toDateTime(b));
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
    const totalSpent = bookings
      .filter((b) => b.payment?.isPaid)
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    return { total, paid, unpaid, totalSpent };
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
    <section className="bg-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-10">
      {isStaffOrAdmin && (
        <HeroStatsCard stats={stats} onRefresh={fetchBookings} />
      )}

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
        onPayment={handleOpenPaymentModal}
        userRole={role}
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
      {isModalOpen && (
        <EditBookingModal
          booking={selectedBooking}
          onClose={handleCloseModal}
          onSave={handleSaveBooking}
        />
      )}

      {isPaymentModalOpen && (
        <PaymentModal
          booking={selectedBooking}
          onClose={handleClosePaymentModal}
          onPaymentSuccess={handlePaymentSuccess}
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
        title="Xóa đơn đặt món"
        message="Bạn có chắc chắn muốn xoá đơn đặt món này? Thao tác này không thể hoàn tác."
        confirmLabel="Xoá"
        cancelLabel="Huỷ"
        onConfirm={confirmDelete}
        onCancel={closeDeleteModal}
      />
      </div>
    </section>
  );
};

export default BookingHistory;
