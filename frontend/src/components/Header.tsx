import { NavLink, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hook";
import { useEffect, useRef, useState } from "react";
import { logout } from "../api/authApi";
import { logout as logoutAction } from "../store/slice/authSlice";
import { House, Info, Mail } from "lucide-react";

const Header = () => {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(logoutAction());
      localStorage.removeItem("accessToken");
      setOpen(false);
    }
  };

  const getInitials = (fullName: string): string => {
    return `${fullName.split(" ")[0].charAt(0)}${fullName
      .split(" ")[1]
      .charAt(0)}`;
  };
  return (
    <header className="h-20 w-full bg-[#0f0f0f] flex items-center justify-between px-6">
      {/* Logo */}
      <NavLink to="/" className="flex items-center gap-1.5">
        <span className="text-3xl font-medium text-white tracking-tight">
          Snip.
        </span>
      </NavLink>

      {/* Nav — replace the existing <nav> entirely */}
      <nav
          className="
          fixed md:relative
          bottom-4 md:bottom-auto
          left-1/2 md:left-auto
          -translate-x-1/2 md:translate-x-0
          z-50
          flex items-center gap-1.5
          bg-[#141414]/90 md:bg-[#141414]
          border border-[#222]
          backdrop-blur-xl md:backdrop-blur-none
          rounded-full md:rounded-[10px]
          px-2 py-1.5 md:py-1
          shadow-2xl md:shadow-none
        "
      >
        {[
          { to: "/", label: "Home", icon: <House size={16} /> },
          { to: "/about", label: "About", icon: <Info size={16} /> },
          { to: "/contact", label: "Contact", icon: <Mail size={16} /> },
        ].map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-1.5 transition-all duration-150 font-medium
         h-10 md:h-[34px]
         px-4 md:px-3.5
         rounded-full md:rounded-[7px]
         text-[12px]
         ${
           isActive
             ? "bg-white text-[#0f0f0f]"
             : "text-[#666] hover:text-white hover:bg-[#1c1c1c]"
         }`
            }
          >
            {icon}
            {/* Hide label on very small screens if you prefer icon-only: add `hidden xs:inline` */}
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Actions */}
      {!isAuthenticated && (
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="h-[30px] px-3 text-[12px] font-medium text-[#888] border border-[#333] rounded-md hover:text-white hover:border-[#555] transition-colors flex items-center"
          >
            Login
          </Link>
          <div className="w-px h-4 bg-[#333]" />
          <Link
            to="/register"
            className="h-[30px] px-3 text-[12px] font-medium bg-white text-[#0f0f0f] rounded-md hover:opacity-85 transition-opacity flex items-center"
          >
            Get started
          </Link>
        </div>
      )}

      {isAuthenticated && (
        <div className="flex gap-4">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `text-[13px] font-medium px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                isActive
                  ? "text-white bg-[#1a1a1a]"
                  : "text-[#888] text-white bg-[#1a1a1a]"
              }`
            }
          >
            Dashboard
          </NavLink>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setOpen((p) => !p)}
              className="w-[30px] h-[30px] cursor-pointer rounded-md border border-[#333] hover:border-[#555] hover:bg-[#1a1a1a] flex flex-col items-center justify-center gap-[3px] transition-colors"
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-[3px] h-[3px] rounded-full bg-[#888]"
                />
              ))}
            </button>
            {open && (
              <div className="absolute right-0 top-[40px] w-[220px] bg-[#0f0f0f] border border-[#222] rounded-[10px] overflow-hidden shadow-2xl z-50">
                {/* Profile section */}
                <div className="px-3.5 py-3 border-b border-[#1a1a1a]">
                  <div className="w-7 h-7 rounded-md bg-[#222] flex items-center justify-center text-[12px] font-medium text-[#fff] mb-2">
                    {getInitials(user?.name ?? "")}
                  </div>
                  <p className="text-[13px] font-medium text-white tracking-tight">
                    {user?.name}
                  </p>
                  <p className="text-[11px] text-[#555] mt-0.5">
                    {user?.email}
                  </p>
                </div>

                {/* Logout section */}
                <div className="p-1">
                  <button
                    onClick={handleLogout}
                    className="w-full cursor-pointer h-8 flex items-center gap-2 px-2.5 rounded-md hover:bg-[#1a1a1a] transition-colors group"
                  >
                    <svg
                      className="w-3.5 h-3.5 text-[#e55]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                      <polyline points="16,17 21,12 16,7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    <span className="text-[13px] text-[#e55]">Log out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
