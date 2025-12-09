const ProfileHero = ({ user, roleLabel }) => {
  return (
    <div className="mb-6 rounded-3xl bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 p-6 text-white shadow-xl">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="h-24 w-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl font-bold border-4 border-white/30">
            {user.fullName?.charAt(0).toUpperCase() ||
              user.username?.charAt(0).toUpperCase() ||
              "U"}
          </div>
        </div>

        {/* User Info */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-bold mb-2">
            {user.fullName || user.username}
          </h2>
          <p className="text-emerald-100 mb-4">{user.email}</p>
          {user.createdAt && (
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="px-4 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-semibold">
                📅 Tham gia:{" "}
                {new Date(user.createdAt).toLocaleDateString("vi-VN")}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHero;


