import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Communicate from "./pages/Communicate";
import Workshop from "./pages/Workshop";
import Material from "./pages/Material";
import Admin from "./pages/Admin";
import Store from "./pages/Store";
import Footer from "./components/Footer";
import { PetProvider } from "./lib/PetContext";
import CursorPet from "./components/CursorPet";
import PetSelector from "./components/PetSelector";
import LayoutGridGuide from "./components/LayoutGridGuide";

export default function App() {
  const [activePage, setActivePage] = useState("home");

  const renderPage = () => {
    switch (activePage) {
      case "home": return <Home onNavigate={setActivePage} />;
      case "about": return <AboutUs />;
      case "communicate": return <Communicate />;
      case "workshop": return <Workshop onNavigate={setActivePage} />;
      case "material": return <Material />;
      case "store": return <Store />;
      case "admin": return <Admin />;
      default: return <Home onNavigate={setActivePage} />;
    }
  };

  return (
    <PetProvider>
      <main className={`relative min-h-screen transition-colors duration-300 selection:bg-[#D1FF00] selection:text-black ${
        activePage === "about" ? "bg-transparent" : "bg-[#FFFFFF]"
      }`}>
        {/* Lớp Phủ Lưới Toàn Cục */}
        <div className="fixed inset-0 pointer-events-none z-[120] border-[20px] border-black/5"></div>
        
        <Navbar activePage={activePage} onNavigate={setActivePage} />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="relative"
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>

        <Footer />
        
        <CursorPet />
        <PetSelector />
        <LayoutGridGuide />


      </main>
    </PetProvider>
  );
}
