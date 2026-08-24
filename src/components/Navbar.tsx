import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  Database,
  Newspaper,
  Hammer,
  Image as ImageIcon,
  ShieldCheck,
  ShoppingBag,
  Activity,
  Search,
  ShoppingCart,
  User,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import MarqueeTicker from "./MarqueeTicker";
import Logo from "./Logo";
import PageContainer from "./PageContainer";

interface NavbarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const NAV_ITEMS = [
  { id: "about", label: "ABOUT US" },
  { id: "material", label: "MATERIAL" },
  { id: "workshop", label: "WORKSHOP" },
  { id: "store", label: "STORE" },
] as const;

// CẤU HÌNH NAVBAR CHUNG
const NAV_CONFIG = {
  fontSize: "14px",       // Chỉnh kích thước chữ tổng thể tại đây
  px: "24px",             // Chỉnh khoảng cách ngang các trang (cách đều nhau)
  letterSpacing: "0.1em", // Chỉnh độ thưa của chữ tại đây

  // Cấu hình Logo
  logoScale: 1.0,         // Tỉ lệ scale logo (ví dụ: 1.0 = 100%, 0.85 = 85%)
  logoOffsetX: 0,         // Dịch chuyển ngang logo chuẩn lề trái container

  // Cấu hình Khoảng Cách Các Phần Tử Bên Phải (Tìm kiếm, Giỏ hàng, Login)
  rightGap: "20px",       // Khoảng cách cách đều nhau giữa các phần tử bên phải
  rightOffsetX: 0,        // Dịch chuyển ngang cụm bên phải chuẩn lề phải container
};

export default function Navbar({ activePage, onNavigate }: NavbarProps) {
  const isDarkPage = activePage === "home" || activePage === "admin" || activePage === "store" || activePage === "about";
  const isAboutPage = activePage === "about";
  const [logoHovered, setLogoHovered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileNavigate = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-[10000] flex flex-col">
      {/* Dòng Chữ Chạy Trên Đầu Navbar */}
      <MarqueeTicker activePage={activePage} />

      {/* Thanh Điều Hướng Chính */}
      <nav
        className={cn(
          "h-20 w-full transition-all duration-500 relative bg-transparent flex items-center",
          isAboutPage ? "text-[#FF009C]" : "text-[#0020D7]"
        )}
      >
        <PageContainer size="full" className="h-full bg-transparent">
          <div className="w-full flex lg:grid lg:grid-cols-[1fr_auto_1fr] items-center justify-between h-full bg-transparent">
            {/* Mục Logo */}
            <div
              className="flex items-center gap-3 cursor-pointer justify-start h-full"
              onClick={() => handleMobileNavigate("home")}
              onMouseEnter={() => setLogoHovered(true)}
              onMouseLeave={() => setLogoHovered(false)}
              style={{
                transform: `translateX(${NAV_CONFIG.logoOffsetX}px) scale(${logoHovered ? NAV_CONFIG.logoScale * 1.1 : NAV_CONFIG.logoScale})`,
                transformOrigin: "left center", // Luôn giữ gốc neo lề trái theo layout guide khi scale/dịch chuyển
                transition: "transform 300ms ease-out",
              }}
            >
              <Logo
                className="h-8 sm:h-10 w-auto"
                fillColor={isAboutPage ? (logoHovered ? "#D1FF00" : "#FF009C") : (logoHovered ? "#FF009C" : "#0020D7")}
                glowing={logoHovered}
              />
            </div>

            {/* Các Mục Điều Hướng Desktop (lg+) */}
            <div className="hidden lg:flex items-center justify-center h-full">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={cn(
                    "h-full px-3.5 xl:px-6 font-display font-bold transition-all flex items-center gap-2 relative group uppercase overflow-hidden text-[13px] xl:text-[14px] tracking-[0.08em]",
                    activePage === item.id
                      ? isAboutPage
                        ? "text-[#FF009C]"
                        : "text-[#0020D7]"
                      : isAboutPage
                        ? "text-[#FF009C]/85 hover:text-[#D1FF00]"
                        : "text-[#0020D7]/50 hover:text-[#FF009C]"
                  )}
                >
                  <span>
                    {item.label}
                  </span>

                  {/* Hiệu Ứng Gạch Chân Khi Active */}
                  {activePage === item.id && (
                    <motion.div
                      layoutId="activeUnderline"
                      className={cn(
                        "absolute bottom-5 left-0 right-0 h-[3px]",
                        isAboutPage ? "bg-[#FF009C]" : "bg-[#0020D7]"
                      )}
                      initial={false}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Phần Bên Phải: Tìm Kiếm, Giỏ Hàng, Đăng Nhập, Hamburger (Mobile/Tablet) */}
            <div
              className="flex items-center justify-end h-full gap-3 sm:gap-5"
              style={{
                transform: `translateX(${NAV_CONFIG.rightOffsetX}px)`,
                transition: "transform 300ms ease-out",
              }}
            >
              {/* Thanh Tìm Kiếm */}
              <div className={cn(
                "hidden sm:flex items-center px-3 py-1 gap-2 group transition-all",
                isAboutPage
                  ? "bg-[#FF009C]/10 border border-[#FF009C]/40 focus-within:border-[#D1FF00]"
                  : "bg-[#0020D7] text-white border border-[#0020D7] focus-within:border-[#FF009C]"
              )}>
                <Search
                  size={14}
                  className={cn(
                    "transition-colors",
                    isAboutPage
                      ? "text-[#FF009C] group-focus-within:text-[#D1FF00]"
                      : "text-white/80 group-focus-within:text-[#FF009C]"
                  )}
                />
                <input
                  type="text"
                  placeholder="SEARCH_SYS..."
                  className={cn(
                    "bg-transparent border-none outline-none font-display font-bold text-[10px] w-24 md:w-32",
                    isAboutPage
                      ? "text-[#FF009C] placeholder:text-[#FF009C]/60 focus:placeholder:text-[#D1FF00]/60"
                      : "text-white placeholder:text-white/70"
                  )}
                />
              </div>

              {/* Giỏ Hàng */}
              <button
                className={cn(
                  "relative p-2 transition-colors group",
                  isAboutPage
                    ? "text-[#D1FF00] hover:text-[#FF009C]"
                    : "text-[#0020D7] hover:text-[#FF009C]"
                )}
              >
                <ShoppingCart size={18} />
                <span className={cn(
                  "absolute top-1 right-1 w-3 h-3 text-[#FFFFFF] text-[8px] font-bold flex items-center justify-center rounded-sm transition-colors",
                  isAboutPage
                    ? "bg-[#FF009C] border border-[#D1FF00] group-hover:bg-[#D1FF00]"
                    : "bg-[#FF009C] border border-[#0020D7] group-hover:bg-[#0020D7]"
                )}>
                  0
                </span>
              </button>

              {/* Nút Đăng Nhập Desktop */}
              <button
                onClick={() => onNavigate("admin")}
                className={cn(
                  "hidden md:flex items-center gap-2 px-4 h-8 font-display text-[10px] transition-all uppercase tracking-widest font-bold",
                  isAboutPage
                    ? "bg-[#D1FF00] text-[#FF009C] border border-[#FFFFFF] hover:bg-[#FF009C] hover:text-[#FFFFFF] hover:border-[#D1FF00]"
                    : "bg-[#0020D7] text-[#D1FF00] border border-[#FF009C] hover:bg-[#D1FF00] hover:text-[#0020D7]"
                )}
              >
                <User size={14} />
                LOGIN_SYS
              </button>

              {/* Nút Toggle Hamburger Menu Mobile/iPad */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={cn(
                  "lg:hidden p-2 brutalist-border font-bold flex items-center justify-center transition-colors",
                  isAboutPage
                    ? "bg-[#FF009C] text-white border-white"
                    : "bg-[#0020D7] text-white border-black"
                )}
                aria-label="Toggle Mobile Menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </PageContainer>
      </nav>

      {/* Drawer Overlay Menu Cho Mobile & iPad (< lg) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden w-full bg-[#000000] border-b-4 border-[#0020D7] text-white px-6 py-6 overflow-hidden shadow-2xl z-[9999]"
          >
            <div className="flex flex-col space-y-4">
              {/* Thanh Tìm Kiếm Mobile */}
              <div className="sm:hidden flex items-center px-4 py-2 bg-white/10 border border-white/20 rounded-none mb-2">
                <Search size={16} className="text-[#D1FF00] mr-2" />
                <input
                  type="text"
                  placeholder="SEARCH_SYS..."
                  className="bg-transparent border-none outline-none font-mono text-xs w-full text-white placeholder:text-white/50"
                />
              </div>

              {/* Danh Sách Điều Hướng Mobile */}
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleMobileNavigate(item.id)}
                  className={cn(
                    "w-full text-left font-display font-black text-xl sm:text-2xl tracking-widest py-3 px-4 transition-all brutalist-border border-black flex justify-between items-center uppercase",
                    activePage === item.id
                      ? "bg-[#D1FF00] text-black border-l-8 border-l-[#FF009C]"
                      : "bg-[#111111] text-white hover:bg-[#0020D7] hover:text-[#D1FF00]"
                  )}
                >
                  <span>{item.label}</span>
                  <span className="font-mono text-xs text-[#FF009C] font-normal">/SYS_0{item.id}</span>
                </button>
              ))}

              {/* Nút Login Mobile */}
              <button
                onClick={() => handleMobileNavigate("admin")}
                className="w-full mt-4 py-4 bg-[#FF009C] text-white font-display font-bold text-lg uppercase tracking-widest border-2 border-white flex items-center justify-center gap-3 brutalist-border"
              >
                <User size={20} />
                LOGIN_SYS SYSTEM
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
