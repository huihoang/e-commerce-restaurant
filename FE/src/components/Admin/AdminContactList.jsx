import { useCallback, useEffect, useMemo, useState } from "react";
import Pagination from "@/components/common/Pagination";
import DropdownSelect from "@/components/common/DropdownSelect";
import { useNotification } from "@/contexts/NotificationContext";

const AdminContactList = () => {
  const { showSuccess, showError } = useNotification();
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const fetchContacts = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/contact`);
      const data = await res.json();
      setContacts(data);
    } catch (error) {
      console.error(error);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleDelete = async (id) => {
    if (!globalThis.confirm("Bạn có chắc chắn muốn xóa liên hệ này không?")) {
      return;
    }
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
    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-600 p-6 text-white shadow-2xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/70">
              Trung tâm liên hệ
            </p>
            <h1 className="mt-1 text-3xl font-semibold">
              Hộp thư khách hàng
            </h1>
            <p className="mt-2 text-sm text-white/80">
              Theo dõi phản hồi, xử lý góp ý và hỗ trợ khách hàng nhanh chóng.
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">
              Tổng thư
            </p>
            <p className="text-4xl font-bold">{contacts.length}</p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-4 shadow-xl shadow-slate-200/60 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Tìm theo tên, email hoặc nội dung..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-2 pl-11 text-sm text-slate-700 shadow-inner focus:border-cyan-500 focus:outline-none"
            />
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg">
              🔍
            </span>
          </div>
          <DropdownSelect
            options={categoryOptions}
            value={categoryFilter}
            onChange={setCategoryFilter}
            placeholder="Chọn chủ đề"
            className="w-full lg:w-60"
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {paginatedContacts.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-slate-200 p-10 text-center text-slate-500">
              Không có liên hệ nào khớp điều kiện tìm kiếm.
            </div>
          )}
          {paginatedContacts.map((contact) => (
            <article
              key={contact._id}
              className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-5 shadow-lg shadow-slate-200 transition hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {contact.name}
                  </p>
                  <p className="text-xs text-slate-400">{contact.email}</p>
                </div>
                <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700">
                  {contact.subject || "Chung"}
                </span>
              </div>
              <p className="mt-4 text-sm text-slate-600 whitespace-pre-line">
                {contact.message}
              </p>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                <span>
                  {contact.createdAt
                    ? new Date(contact.createdAt).toLocaleString("vi-VN")
                    : "—"}
                </span>
                <button
                  onClick={() => handleDelete(contact._id)}
                  className="rounded-full bg-rose-600/10 px-4 py-1.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-600 hover:text-white"
                >
                  🗑 Xoá
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </section>
    </div>
  );
};

export default AdminContactList;