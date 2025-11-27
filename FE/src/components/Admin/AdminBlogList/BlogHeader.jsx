const BlogHeader = ({ blogItems }) => {
  const totalPosts = blogItems.length;
  const totalCategories = new Set(blogItems.map((b) => b.category)).size;
  const latestTitle = blogItems[0]?.title || "Chưa có";

  return (
    <section className="rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 text-white shadow-2xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-white/70">
            Trung tâm nội dung
          </p>
          <h1 className="mt-1 text-3xl font-semibold">
            Quản lý bài viết & tin tức
          </h1>
          <p className="mt-2 text-sm text-white/80">
            Chia sẻ câu chuyện, mẹo hay và thông tin mới nhất cùng khách hàng.
          </p>
        </div>
        <div className="mt-2 grid grid-cols-1 gap-3 text-center sm:grid-cols-3 md:w-[420px]">
          {[
            {
              label: "Tổng bài viết",
              value: totalPosts,
              accent: "text-white",
            },
            {
              label: "Danh mục",
              value: totalCategories,
              accent: "text-amber-200",
            },
            {
              label: "Bài mới nhất",
              value: latestTitle,
              accent: "text-white",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm"
            >
              <p className="text-xs uppercase tracking-widest text-white/80">
                {stat.label}
              </p>
              <p className={`mt-1 text-xl font-semibold ${stat.accent}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogHeader;


