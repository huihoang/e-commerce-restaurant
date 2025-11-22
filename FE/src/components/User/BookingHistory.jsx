import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import EditBookingModal from "./EditBookingModal";
import PaymentModal from "./PaymentModal";
import BookingDetail from "./BookingDetail";
import Pagination from "@/components/common/Pagination";
import HeroStatsCard from "./BookingHistory/HeroStatsCard";
import BookingTabs from "./BookingHistory/BookingTabs";
import BookingFilters from "./BookingHistory/BookingFilters";
import BookingHistoryList from "./BookingHistory/BookingHistoryList";

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dine-in");
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  // ==================== Mock Data Generator ====================
  const generateMockData = (booking) => {
    const orderTypes = ["dine-in", "takeaway"];
    const orderType = orderTypes[Math.floor(Math.random() * orderTypes.length)];

    return {
      ...booking,
      discount: Math.floor(Math.random() * 31),
      orderType: orderType,
      tableNumber:
        orderType === "dine-in" ? Math.floor(Math.random() * 20) + 1 : null,
      shippingInfo:
        orderType === "takeaway"
          ? {
              shipperName:
                ["Nguyễn Văn A", "Trần Thị B", "Lê Văn C", "Phạm Thị D"][
                  Math.floor(Math.random() * 4)
                ],
              shipperPhone: `0${Math.floor(Math.random() * 900000000) + 100000000}`,
              estimatedTime: `${Math.floor(Math.random() * 30) + 15} phút`,
              address: booking.note || "123 Đường ABC, Quận XYZ, TP.HCM",
            }
          : null,
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

        const sortedBookings = res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

      const bookingsWithMock = sortedBookings.map((booking) =>
        generateMockData(booking)
      );
      setBookings(bookingsWithMock);
      } catch (err) {
        console.error("❌ Lỗi khi lấy lịch sử đặt bàn:", err.message);
    } finally {
      setLoading(false);
      }
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const calculateTotalAmount = (selectedDishes, discount = 0) => {
    const subtotal = selectedDishes.reduce((total, dishItem) => {
      return total + dishItem.dishId.price * dishItem.quantity;
    }, 0);
    return {
      subtotal,
      total: subtotal - (subtotal * discount) / 100,
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
    const amounts = calculateTotalAmount(
      updatedBooking.selectedDishes,
      updatedBooking.discount || 0
    );
    updatedBooking.totalAmount = amounts.total;

    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking._id === updatedBooking._id ? updatedBooking : booking
      )
    );
    handleCloseModal();
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!globalThis.confirm("Bạn có chắc chắn muốn xóa đơn đặt món này không?")) {
      return;
    }
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
    } catch (err) {
      console.error("❌ Lỗi khi xóa đặt bàn:", err.message);
    }
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
    return bookings.filter((b) => b.orderType === activeTab);
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
      result = result.filter(
        (b) => b.isPaid === (paymentFilter === "paid")
      );
    }

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
    const filtered = bookings.filter((b) => b.orderType === activeTab);
    const total = filtered.length;
    const paid = filtered.filter((b) => b.isPaid).length;
    const unpaid = total - paid;
    const totalSpent = filtered
      .filter((b) => b.isPaid)
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    return { total, paid, unpaid, totalSpent };
  }, [bookings, activeTab]);

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
      <HeroStatsCard stats={stats} onRefresh={fetchBookings} />

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
        onDelete={handleDeleteBooking}
        onPayment={handleOpenPaymentModal}
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
    </div>
  );
};

export default BookingHistory;
