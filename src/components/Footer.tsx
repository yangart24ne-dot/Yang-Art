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
  contactTitle: {
    left: 74.5,
    top: 89.6,
    scale: 1.0,
    width: 17.36,
  },
  contactPhone: {
    left: 74.5,
    top: 91.8,
    scale: 1.0,
    width: 17.36,
  },
  contactEmail: {
    left: 74.5,
    top: 93.8,
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

      {/* 6A. CONTACT US TITLE */}
      <div
        className="absolute flex items-center justify-center select-none pointer-events-none"
        style={{
          left: `${FOOTER_ASSETS_CONFIG.contactTitle.left}%`,
          top: `${FOOTER_ASSETS_CONFIG.contactTitle.top}%`,
          width: `${FOOTER_ASSETS_CONFIG.contactTitle.width}%`,
          transform: `scale(${FOOTER_ASSETS_CONFIG.contactTitle.scale})`,
          transformOrigin: "center center",
          zIndex: 10,
        }}
      >
        <svg viewBox="75 5 106 17" className="w-full h-auto">
          <path d="M79.7801 20.22C78.2534 20.22 77.1067 19.7867 76.3401 18.92C75.5801 18.0467 75.2001 16.8167 75.2001 15.23V11.97C75.2001 10.3833 75.5767 9.16 76.3301 8.3C77.0901 7.43333 78.2234 7 79.7301 7C80.2434 7 80.7101 7.05333 81.1301 7.16C81.5501 7.26 81.9201 7.39 82.2401 7.55C82.5667 7.71 82.8401 7.87333 83.0601 8.04L83.1801 9.22C82.7801 8.92 82.3101 8.66 81.7701 8.44C81.2301 8.21333 80.5967 8.1 79.8701 8.1C78.7501 8.1 77.9001 8.43667 77.3201 9.11C76.7467 9.78333 76.4601 10.7433 76.4601 11.99V15.19C76.4601 16.43 76.7501 17.39 77.3301 18.07C77.9167 18.75 78.7901 19.09 79.9501 19.09C80.6701 19.09 81.3034 18.98 81.8501 18.76C82.3967 18.54 82.8734 18.2733 83.2801 17.96L83.1701 19.16C82.9501 19.3333 82.6734 19.5 82.3401 19.66C82.0067 19.82 81.6267 19.9533 81.2001 20.06C80.7734 20.1667 80.3001 20.22 79.7801 20.22ZM89.8038 20.22C88.2505 20.22 87.0672 19.7833 86.2538 18.91C85.4472 18.0367 85.0438 16.79 85.0438 15.17V12.04C85.0438 10.4267 85.4472 9.18333 86.2538 8.31C87.0672 7.43667 88.2505 7 89.8038 7C91.3505 7 92.5305 7.43667 93.3438 8.31C94.1572 9.18333 94.5638 10.4267 94.5638 12.04V15.17C94.5638 16.79 94.1572 18.0367 93.3438 18.91C92.5305 19.7833 91.3505 20.22 89.8038 20.22ZM89.8038 19.17C90.9572 19.17 91.8272 18.8267 92.4138 18.14C93.0072 17.4467 93.3038 16.47 93.3038 15.21V12C93.3038 10.7333 93.0072 9.76 92.4138 9.08C91.8272 8.39333 90.9572 8.05 89.8038 8.05C88.6505 8.05 87.7772 8.39333 87.1838 9.08C86.5972 9.76 86.3038 10.7333 86.3038 12V15.21C86.3038 16.47 86.5972 17.4467 87.1838 18.14C87.7772 18.8267 88.6505 19.17 89.8038 19.17ZM97.3016 7.22H99.2416L105.002 18.69H105.132L105.082 13.05V7.22H106.292V20H104.392L98.6016 8.46H98.4716L98.5216 14.42V20H97.3016V7.22ZM113.758 20H112.508V7.41H113.758V20ZM117.668 8.27H108.598V7.22H117.668V8.27ZM118.645 20H117.375L121.475 7.22H123.515L127.615 20H126.355L122.625 8.08H122.365L118.645 20ZM125.415 15.98H119.565V14.94H125.415V15.98ZM133.53 20.22C132.003 20.22 130.857 19.7867 130.09 18.92C129.33 18.0467 128.95 16.8167 128.95 15.23V11.97C128.95 10.3833 129.327 9.16 130.08 8.3C130.84 7.43333 131.973 7 133.48 7C133.993 7 134.46 7.05333 134.88 7.16C135.3 7.26 135.67 7.39 135.99 7.55C136.317 7.71 136.59 7.87333 136.81 8.04L136.93 9.22C136.53 8.92 136.06 8.66 135.52 8.44C134.98 8.21333 134.347 8.1 133.62 8.1C132.5 8.1 131.65 8.43667 131.07 9.11C130.497 9.78333 130.21 10.7433 130.21 11.99V15.19C130.21 16.43 130.5 17.39 131.08 18.07C131.667 18.75 132.54 19.09 133.7 19.09C134.42 19.09 135.053 18.98 135.6 18.76C136.147 18.54 136.623 18.2733 137.03 17.96L136.92 19.16C136.7 19.3333 136.423 19.5 136.09 19.66C135.757 19.82 135.377 19.9533 134.95 20.06C134.523 20.1667 134.05 20.22 133.53 20.22ZM143.68 20H142.43V7.41H143.68V20ZM147.59 8.27H138.52V7.22H147.59V8.27ZM158.577 20.22C157.05 20.22 155.917 19.8133 155.177 19C154.443 18.1867 154.077 17.0167 154.077 15.49V7.22H155.327V15.52C155.327 16.6867 155.87 17.5833 156.107 18.21C156.627 18.8367 157.45 19.15 158.577 19.15C159.71 19.15 160.533 18.8367 161.047 18.21C161.567 17.5833 161.827 16.6867 161.827 15.52V7.22H163.077V15.49C163.077 17.0167 162.707 18.1867 161.967 19C161.233 19.8133 160.103 20.22 158.577 20.22ZM169.648 20.21C169.035 20.21 168.471 20.1567 167.958 20.05C167.451 19.9433 167.001 19.8133 166.608 19.66C166.221 19.5 165.898 19.3433 165.638 19.19L165.508 17.93C166.008 18.25 166.601 18.5267 167.288 18.76C167.981 18.9933 168.745 19.11 169.578 19.11C170.611 19.11 171.385 18.9133 171.898 18.52C172.418 18.12 172.678 17.53 172.678 16.75V16.56C172.678 16.0467 172.578 15.6267 172.378 15.3C172.178 14.9733 171.845 14.7033 171.378 14.49C170.911 14.27 170.271 14.0733 169.458 13.9C168.485 13.68 167.711 13.42 167.138 13.12C166.565 12.82 166.155 12.4433 165.908 11.99C165.661 11.5367 165.538 10.9767 165.538 10.31V10.23C165.538 9.20333 165.868 8.41 166.528 7.85C167.195 7.29 168.205 7.01 169.558 7.01C170.465 7.01 171.235 7.11 171.868 7.31C172.508 7.51 173.021 7.72667 173.408 7.96L173.528 9.13C173.068 8.84333 172.525 8.59667 171.898 8.39C171.271 8.18333 170.545 8.08 169.718 8.08C169.025 8.08 168.465 8.16667 168.038 8.34C167.611 8.51333 167.298 8.76333 167.098 9.09C166.905 9.41667 166.808 9.80667 166.808 10.26V10.31C166.808 10.77 166.901 11.16 167.088 11.48C167.275 11.8 167.601 12.0733 168.068 12.3C168.541 12.5267 169.208 12.74 170.068 12.94C171.028 13.1533 171.788 13.4033 172.348 13.69C172.908 13.97 173.311 14.3367 173.558 14.79C173.811 15.2433 173.938 15.83 173.938 16.55V16.77C173.938 17.8967 173.578 18.7533 172.858 19.34C172.138 19.92 171.068 20.21 169.648 20.21Z" fill="white" />
        </svg>
      </div>

      {/* 6B. CONTACT PHONE */}
      <div
        className="absolute flex items-center justify-center select-none"
        style={{
          left: `${FOOTER_ASSETS_CONFIG.contactPhone.left}%`,
          top: `${FOOTER_ASSETS_CONFIG.contactPhone.top}%`,
          width: `${FOOTER_ASSETS_CONFIG.contactPhone.width}%`,
          transform: `scale(${FOOTER_ASSETS_CONFIG.contactPhone.scale})`,
          transformOrigin: "center center",
          zIndex: 10,
        }}
      >
        <a
          href="tel:+84931451801"
          className="inline-block text-white font-black tracking-wide cursor-pointer hover:opacity-80 transition-opacity whitespace-nowrap"
          style={{
            fontFamily: "'AnekDevanagari', sans-serif",
            fontSize: "clamp(10px, 1.1vw, 16px)",
          }}
          title="Call Us"
        >
          (+84) 931 451 801
        </a>
      </div>

      {/* 6C. CONTACT EMAIL */}
      <div
        className="absolute flex items-center justify-center select-none"
        style={{
          left: `${FOOTER_ASSETS_CONFIG.contactEmail.left}%`,
          top: `${FOOTER_ASSETS_CONFIG.contactEmail.top}%`,
          width: `${FOOTER_ASSETS_CONFIG.contactEmail.width}%`,
          transform: `scale(${FOOTER_ASSETS_CONFIG.contactEmail.scale})`,
          transformOrigin: "center center",
          zIndex: 10,
        }}
      >
        <a
          href="mailto:hello.relifelabvn@gmail.com"
          className="inline-block text-white font-bold tracking-normal cursor-pointer hover:opacity-80 transition-opacity whitespace-nowrap"
          style={{
            fontFamily: "'AnekDevanagari', sans-serif",
            fontSize: "clamp(9px, 0.9vw, 14px)",
          }}
          title="Email Us"
        >
          hello.relifelabvn@gmail.com
        </a>
      </div>
    </footer>
  );
}
