import { useCallback, useEffect, useMemo, useState } from "react";
import Pagination from "@/components/common/Pagination";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useNotification } from "@/contexts/NotificationContext";
import ContactHeroSection from "@/components/Admin/AdminContactList/ContactHeroSection";
import ContactFiltersBar from "@/components/Admin/AdminContactList/ContactFiltersBar";
import ContactCardsGrid from "@/components/Admin/AdminContactList/ContactCardsGrid";

const AdminContactList = () => {
  const { showSuccess, showError } = useNotification();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    contactId: null,
  });

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/contact`);
      const data = await res.json();
      setContacts(data);
    } catch (error) {
      console.error("❌ Lỗi khi lấy liên hệ:", error);
      showError("Không thể tải danh sách liên hệ!");
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, showError]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/contact/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showSuccess("Xóa liên hệ thành công!");
        setContacts((prev) => prev.filter((contact) => contact._id !== id));
      } else {
        showError("Lỗi khi xóa liên hệ!");
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
      showError("Lỗi khi xóa liên hệ!");
    }
  };

  const openDeleteModal = (contactId) => {
    setConfirmModal({ open: true, contactId });
  };

  const closeDeleteModal = () => {
    setConfirmModal({ open: false, contactId: null });
  };

  const confirmDeleteContact = async () => {
    if (!confirmModal.contactId) return;
    await handleDelete(confirmModal.contactId);
    closeDeleteModal();
  };

  const categoryOptions = useMemo(() => {
    const categories = new Set(contacts.map((c) => c.subject || "Khác"));
    return [
      {
        label: "Tất cả chủ đề",
        value: "all",
        badge: "bg-slate-100 text-slate-600",
        badgeLabel: "ALL",
      },
      ...Array.from(categories).map((subject) => ({
        label: subject,
        value: subject,
        badge: "bg-blue-50 text-blue-600",
        badgeLabel: subject.slice(0, 3).toUpperCase(),
      })),
    ];
  }, [contacts]);

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      const matchesSearch =
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.message.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" ? true : contact.subject === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [contacts, searchTerm, categoryFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredContacts.length / ITEMS_PER_PAGE)
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, filteredContacts.length]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedContacts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredContacts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredContacts, currentPage]);

  return (
    <>
      <div className="space-y-6">
        <ContactHeroSection totalContacts={contacts.length} />

        <section className="rounded-3xl border border-slate-100 bg-white p-4 shadow-xl shadow-slate-200/60 sm:p-6">
          <ContactFiltersBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            categoryFilter={categoryFilter}
            categoryOptions={categoryOptions}
            onCategoryChange={setCategoryFilter}
          />

          <ContactCardsGrid
            loading={loading}
            contacts={paginatedContacts}
            hasFiltersApplied={Boolean(searchTerm || categoryFilter !== "all")}
            onDelete={openDeleteModal}
          />

          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </section>
      </div>
      <ConfirmModal
        open={confirmModal.open}
        title="Xóa liên hệ"
        message="Bạn có chắc chắn muốn xoá phản hồi này khỏi hộp thư?"
        confirmLabel="Xoá"
        cancelLabel="Huỷ"
        onConfirm={confirmDeleteContact}
        onCancel={closeDeleteModal}
      />
    </>
  );
};

export default AdminContactList;