const ContactHeroSection = ({ totalContacts }) => {
  return (
    <section className="rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-600 p-6 text-white shadow-2xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-white/70">
            Trung tâm liên hệ
          </p>
          <h1 className="mt-1 text-3xl font-semibold">Hộp thư khách hàng</h1>
          <p className="mt-2 text-sm text-white/80">
            Theo dõi phản hồi, xử lý góp ý và hỗ trợ khách hàng nhanh chóng.
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">
            Tổng thư
          </p>
          <p className="text-4xl font-bold">{totalContacts}</p>
        </div>
      </div>
    </section>
  );
};

export default ContactHeroSection;

