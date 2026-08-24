import React, { useState } from "react";
import lotNenImg from "../assets/infor material/lót nền.png";
import customFooterImg from "../assets/infor material/footer.png";
import group39474Img from "../assets/infor material/Group 39474.png";
import beFirstSvg from "../assets/infor material/BE THE FIRST TO KNOW.svg";
import logoNameFooterSvg from "../assets/infor material/logonamefooter.svg";
import followUsSvg from "../assets/infor material/Group 39477.svg";
import contactUsSvg from "../assets/infor material/Group 39478.svg";
import privacyTextSvg from "../assets/infor material/RE-LIFE Lab respects your privacy as much as we respect the planet. No spam, no selling your data - your secrets are safe in our vault. Drop your email to unlock exclusive lab drops, early collection access, and on-chain events..svg";

export const FOOTER_ASSETS_CONFIG = {
  lotNen: {
    offsetX: 0,
    offsetY: 0,
    scale: 1.0,
  },
  background: {
    offsetX: 0,
    offsetY: 0,
    scale: 1.0,
  },
  movementBanner: {
    left: 0,
    top: 3.5,
    scale: 0.88,
    width: 100,
  },
  beFirst: {
    left: 34.27,
    top: 64.9,
    scale: 1.0,
    width: 31.45,
  },
  emailForm: {
    left: 28.68,
    top: 68.6,
    scale: 1.0,
    width: 42.64,
  },
  privacy: {
    left: 29.86,
    top: 74.93,
    scale: 1.0,
    width: 40.27,
  },
  logo: {
    left: 8.54,
    top: 84.85,
    scale: 1.0,
    width: 29.3,
  },
  followUs: {
    left: 64.3,
    top: 89.97,
    scale: 1.0,
    width: 6.6,
  },
  contactUs: {
    left: 74.5,
    top: 89.97,
    scale: 1.0,
    width: 17.36,
  },
};

const EmailSubscribeForm = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thank you for subscribing! Registered: ${email}`);
    setEmail("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-full flex items-center bg-white rounded-[41px] relative select-none border border-neutral-200/20 overflow-hidden"
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="EMAIL ADDRESS"
        className="w-[67.5%] h-full pl-6 pr-2 bg-transparent text-black font-mono text-[8px] sm:text-[10px] md:text-[12px] outline-none border-none placeholder-neutral-400 font-bold rounded-l-[41px]"
        style={{
          WebkitBoxShadow: "0 0 0 100px white inset",
        }}
        required
      />
      <button
        type="submit"
        className="w-[32.5%] h-full bg-[#FF0087] text-white font-mono font-black text-[8px] sm:text-[10px] md:text-[12px] tracking-widest uppercase cursor-pointer hover:bg-[#d6006e] transition-colors flex items-center justify-center rounded-[30px_41px_41px_30px]"
      >
        JOIN NOW !!!
      </button>
    </form>
  );
};

export default function Footer() {
  return (
    <footer className="w-full relative overflow-hidden bg-transparent select-none" style={{ aspectRatio: "1440 / 1895" }}>
      {/* Layer 0 (Layer cuối cùng dưới đáy): Lót nền (lót nền.png) */}
      <img
        src={lotNenImg}
        alt="Lót nền background"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
        style={{
          transform: `translate(${FOOTER_ASSETS_CONFIG.lotNen.offsetX}px, ${FOOTER_ASSETS_CONFIG.lotNen.offsetY}px) scale(${FOOTER_ASSETS_CONFIG.lotNen.scale})`,
          transformOrigin: "center center",
          zIndex: 0,
        }}
      />

      {/* Layer 1: Footer Graphic (footer.png) */}
      <img
        src={customFooterImg}
        alt="Material Footer Graphic"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
        style={{
          transform: `translate(${FOOTER_ASSETS_CONFIG.background.offsetX}px, ${FOOTER_ASSETS_CONFIG.background.offsetY}px) scale(${FOOTER_ASSETS_CONFIG.background.scale})`,
          transformOrigin: "center center",
          zIndex: 1,
        }}
      />

      {/* Movement Banner (Group 39474.png - NOT A BRAND. IT'S A MOVEMENT) */}
      <div
        className="absolute"
        style={{
          left: `${FOOTER_ASSETS_CONFIG.movementBanner.left}%`,
          top: `${FOOTER_ASSETS_CONFIG.movementBanner.top}%`,
          width: `${FOOTER_ASSETS_CONFIG.movementBanner.width}%`,
          transform: `scale(${FOOTER_ASSETS_CONFIG.movementBanner.scale})`,
          transformOrigin: "center center",
          zIndex: 2,
        }}
      >
        <div className="relative w-full">
          <img
            src={group39474Img}
            alt="Not A Brand It's A Movement"
            className="w-full h-auto object-contain pointer-events-none select-none"
          />
          <a
            href="#connect"
            onClick={(e) => {
              e.preventDefault();
              const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
              if (emailInput) {
                emailInput.focus();
                emailInput.scrollIntoView({ behavior: "smooth", block: "center" });
              }
            }}
            className="absolute cursor-pointer"
            style={{
              left: "4.8%",
              top: "40.5%",
              width: "25.2%",
              height: "17%",
              borderRadius: "9999px",
            }}
            title="Connect With Us"
          />
        </div>
      </div>

      {/* 1. BE THE FIRST TO KNOW */}
      <img
        src={beFirstSvg}
        alt="Be The First To Know"
        className="absolute pointer-events-none select-none"
        style={{
          left: `${FOOTER_ASSETS_CONFIG.beFirst.left}%`,
          top: `${FOOTER_ASSETS_CONFIG.beFirst.top}%`,
          width: `${FOOTER_ASSETS_CONFIG.beFirst.width}%`,
          transform: `scale(${FOOTER_ASSETS_CONFIG.beFirst.scale})`,
          transformOrigin: "center center",
          zIndex: 2,
        }}
      />

      {/* 2. Interactive Email Subscribe Form */}
      <div
        className="absolute"
        style={{
          left: `${FOOTER_ASSETS_CONFIG.emailForm.left}%`,
          top: `${FOOTER_ASSETS_CONFIG.emailForm.top}%`,
          width: `${FOOTER_ASSETS_CONFIG.emailForm.width}%`,
          aspectRatio: "614 / 82",
          transform: `scale(${FOOTER_ASSETS_CONFIG.emailForm.scale})`,
          transformOrigin: "center center",
          zIndex: 10,
        }}
      >
        <EmailSubscribeForm />
      </div>

      {/* 3. PRIVACY TEXT */}
      <img
        src={privacyTextSvg}
        alt="Privacy Policy Text"
        className="absolute pointer-events-none select-none"
        style={{
          left: `${FOOTER_ASSETS_CONFIG.privacy.left}%`,
          top: `${FOOTER_ASSETS_CONFIG.privacy.top}%`,
          width: `${FOOTER_ASSETS_CONFIG.privacy.width}%`,
          transform: `scale(${FOOTER_ASSETS_CONFIG.privacy.scale})`,
          transformOrigin: "center center",
          zIndex: 2,
        }}
      />

      {/* 4. LOGO & NAME FOOTER */}
      <img
        src={logoNameFooterSvg}
        alt="Relife Logo Name Footer"
        className="absolute pointer-events-none select-none"
        style={{
          left: `${FOOTER_ASSETS_CONFIG.logo.left}%`,
          top: `${FOOTER_ASSETS_CONFIG.logo.top}%`,
          width: `${FOOTER_ASSETS_CONFIG.logo.width}%`,
          transform: `scale(${FOOTER_ASSETS_CONFIG.logo.scale})`,
          transformOrigin: "center center",
          zIndex: 2,
        }}
      />

      {/* 5. FOLLOW US BUTTONS */}
      <div
        className="absolute"
        style={{
          left: `${FOOTER_ASSETS_CONFIG.followUs.left}%`,
          top: `${FOOTER_ASSETS_CONFIG.followUs.top}%`,
          width: `${FOOTER_ASSETS_CONFIG.followUs.width}%`,
          aspectRatio: "95 / 71",
          transform: `scale(${FOOTER_ASSETS_CONFIG.followUs.scale})`,
          transformOrigin: "center center",
          zIndex: 10,
        }}
      >
        <div className="relative w-full h-full">
          <img src={followUsSvg} alt="Follow Us" className="w-full h-full object-contain pointer-events-none select-none" />
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="absolute cursor-pointer"
            style={{ left: "8.4%", top: "49.3%", width: "37.9%", height: "50.7%" }}
            title="Instagram"
          />
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            className="absolute cursor-pointer"
            style={{ left: "53.6%", top: "47.9%", width: "37.9%", height: "50.7%" }}
            title="Facebook"
          />
        </div>
      </div>

      {/* 6. CONTACT US (Aligned with FOLLOW US) */}
      <div
        className="absolute"
        style={{
          left: `${FOOTER_ASSETS_CONFIG.contactUs.left}%`,
          top: `${FOOTER_ASSETS_CONFIG.contactUs.top}%`,
          width: `${FOOTER_ASSETS_CONFIG.contactUs.width}%`,
          aspectRatio: "250 / 73",
          transform: `scale(${FOOTER_ASSETS_CONFIG.contactUs.scale})`,
          transformOrigin: "center center",
          zIndex: 10,
        }}
      >
        <div className="relative w-full h-full">
          <img
            src={contactUsSvg}
            alt="Contact Us"
            className="w-full h-full object-contain pointer-events-none select-none"
          />
          {/* Phone Clickable Link */}
          <a
            href="tel:+84931451801"
            className="absolute cursor-pointer rounded hover:bg-white/10 transition-colors"
            style={{ left: "8%", top: "39%", width: "84%", height: "26%" }}
            title="Call (+84) 931 451 801"
          />
          {/* Email Clickable Link */}
          <a
            href="mailto:hello.relifelabvn@gmail.com"
            className="absolute cursor-pointer rounded hover:bg-white/10 transition-colors"
            style={{ left: "5%", top: "66%", width: "90%", height: "28%" }}
            title="Email hello.relifelabvn@gmail.com"
          />
        </div>
      </div>
    </footer>
  );
}
