"use client";
import { useEffect, useMemo, useRef, useState } from "react";

const CONTACT = {
  firstName: "Dan",
  lastName: "Donahue",
  phone: "+13129537098",
  email: "macdonahue@mac.com",
};

function buildVCard() {
  const { firstName, lastName, phone, email } = CONTACT;
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${lastName};${firstName};;;`,
    `FN:${firstName} ${lastName}`,
    `TEL;TYPE=CELL:${phone}`,
    `EMAIL:${email}`,
    "END:VCARD",
  ];
  return lines.join("\r\n");
}

function downloadVCard(filename: string, contents: string) {
  const blob = new Blob([contents], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function getSmsHref(message: string) {
  const phone = CONTACT.phone.replace(/[^+\d]/g, "");
  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator as any).platform === "MacIntel" && (navigator as any).maxTouchPoints > 1;
  const encoded = encodeURIComponent(message);
  return isIOS ? `sms:${phone}&body=${encoded}` : `sms:${phone}?body=${encoded}`;
}

export default function Home() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [emailError, setEmailError] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const vcard = useMemo(() => buildVCard(), []);

  useEffect(() => {
    if (showPrompt) {
      setTimeout(() => nameInputRef.current?.focus(), 50);
    }
  }, [showPrompt]);

  // Load cached values
  useEffect(() => {
    try {
      const cachedName = localStorage.getItem("dd_name");
      const cachedEmail = localStorage.getItem("dd_email");
      if (cachedName) setUserName(cachedName);
      if (cachedEmail) setUserEmail(cachedEmail);
    } catch {}
  }, []);

  // Persist values
  useEffect(() => {
    try {
      localStorage.setItem("dd_name", userName);
    } catch {}
  }, [userName]);
  useEffect(() => {
    try {
      localStorage.setItem("dd_email", userEmail);
    } catch {}
  }, [userEmail]);

  const isValidEmail = (val: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  const isValidName = (val: string) => val.trim().length >= 2;

  const buildSmsMessage = () => {
    const name = userName.trim();
    const email = userEmail.trim();
    const who = [name, email && `(${email})`].filter(Boolean).join(" ");
    const whoText = who || "A new contact";
    return `Hi Dan, ${whoText} just saved your contact and has been added to your network.`;
  };

  const handleSaveThenPrompt = () => {
    downloadVCard("Dan_Donahue.vcf", vcard);
    setTimeout(() => setShowPrompt(true), 400);
  };

  const handleSendText = () => {
    const nameOk = isValidName(userName);
    const emailOk = isValidEmail(userEmail);
    if (!nameOk) setNameError("Please enter your full name.");
    if (!emailOk) setEmailError("Please enter a valid email address.");
    if (!nameOk || !emailOk) return;
    const href = getSmsHref(buildSmsMessage());
    window.location.href = href;
  };

  return (
    <main className="min-h-svh w-full bg-gunmetal text-white flex items-center justify-center p-4 sm:p-6">
      <div className="relative w-full max-w-sm sm:max-w-md">
        {/* Card */}
        <div className="relative rounded-3xl bg-card/80 backdrop-blur-sm border border-white/10 shadow-2xl shadow-black/60 ring-1 ring-white/10 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <div className="absolute -inset-1 rounded-[2rem] bg-[linear-gradient(145deg,rgba(255,255,255,0.06)_0%,rgba(0,0,0,0.35)_100%)]" />
          </div>

          <div className="relative p-6 sm:p-7 text-center">
            <header className="mb-5">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                <span className="text-neon">First Name:</span> Dan
              </h1>
              <h2 className="text-xl sm:text-2xl font-medium opacity-90">
                <span className="text-neon">Last Name:</span> Donahue
              </h2>
            </header>

            <section className="space-y-2.5 sm:space-y-3 text-sm sm:text-base">
              <p>
                <span className="text-neon font-medium">Phone:</span>{" "}
                <a className="underline decoration-neon/50 underline-offset-4 hover:text-neon focus:text-neon focus:outline-none" href={`tel:${CONTACT.phone}`}>
                  312.953.7098
                </a>
              </p>
              <p>
                <span className="text-neon font-medium">Email:</span>{" "}
                <a className="underline decoration-neon/50 underline-offset-4 break-all hover:text-neon focus:text-neon focus:outline-none" href={`mailto:${CONTACT.email}`}>
                  {CONTACT.email}
                </a>
              </p>
            </section>

            <div className="mt-6 sm:mt-7 flex w-full justify-center">
              <button
                onClick={handleSaveThenPrompt}
                className="animate-jiggle inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold text-black bg-neon shadow-[0_8px_20px_rgba(57,255,20,0.35)] ring-1 ring-black/20 hover:brightness-110 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-neon/70"
              >
                Save Contact
              </button>
            </div>
          </div>

          <footer className="relative mt-1 border-t border-white/10 bg-black/10 px-6 py-4 sm:px-7">
            <p className="text-center text-xs sm:text-sm tracking-wide">
              Built in America, on earth.
            </p>
            <p className="text-center text-[11px] sm:text-xs italic opacity-80">
              Making relationships built to last, the American Way.
            </p>
          </footer>
        </div>
      </div>

      {/* Prompt modal */}
      {showPrompt && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-card border border-white/10 ring-1 ring-white/10 shadow-xl">
            <div className="p-5">
              <h3 className="text-lg font-semibold mb-2 text-center">Send a quick text?</h3>
              <p className="text-sm opacity-90 mb-4 text-center">
                Contact saved. Add your info so Dan knows who you are.
              </p>
              <form
                className="space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendText();
                }}
              >
                <input
                  ref={nameInputRef}
                  type="text"
                  inputMode="text"
                  autoComplete="name"
                  placeholder="Your full name"
                  value={userName}
                  onChange={(e) => {
                    setUserName(e.target.value);
                    if (nameError && isValidName(e.target.value)) setNameError("");
                  }}
                  className="w-full rounded-lg bg-white/10 px-3 py-2.5 outline-none ring-1 ring-white/10 placeholder-white/50 focus:ring-2 focus:ring-neon/70"
                  required
                />
                {nameError && (
                  <p className="text-xs text-red-400">{nameError}</p>
                )}
                <input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={userEmail}
                  onChange={(e) => {
                    setUserEmail(e.target.value);
                    if (emailError && isValidEmail(e.target.value)) setEmailError("");
                  }}
                  onBlur={(e) => {
                    const v = e.target.value;
                    if (!isValidEmail(v)) setEmailError("Please enter a valid email address.");
                    else setEmailError("");
                  }}
                  className="w-full rounded-lg bg-white/10 px-3 py-2.5 outline-none ring-1 ring-white/10 placeholder-white/50 focus:ring-2 focus:ring-neon/70"
                  required
                />
                {emailError && (
                  <p className="text-xs text-red-400">{emailError}</p>
                )}
                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <button
                    type="submit"
                    className="inline-flex justify-center rounded-lg px-4 py-2.5 font-medium text-black bg-neon ring-1 ring-black/20 hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={!isValidName(userName) || !isValidEmail(userEmail)}
                  >
                    Send Text
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPrompt(false)}
                    className="inline-flex justify-center rounded-lg px-4 py-2.5 font-medium bg-white/10 hover:bg-white/15 ring-1 ring-white/10"
                  >
                    Not Now
                  </button>
                </div>
                <p className="text-[11px] opacity-70 text-center">
                  On mobile, this opens your SMS app with your details prefilled.
                </p>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
