"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollAnimations from "@/components/ScrollAnimations";
import BookingCalendar from "@/components/BookingCalendar";
import { WASTE_CATEGORIES } from "@/lib/waste-categories";
import { WASTE_LOCATIONS, FLOOR_OPTIONS, ACCESS_OPTIONS } from "@/lib/booking-options";

const MAX_PHOTOS = 4;

const inputStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(212,160,23,0.15)",
  borderRadius: "12px",
  padding: "13px 14px",
  color: "var(--cream)",
  fontSize: "15px",
  width: "100%",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.7rem",
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--gold)",
  opacity: 0.85,
  marginBottom: "0.6rem",
  display: "block",
};

function required() {
  return <span style={{ color: "#e08585", marginLeft: 4 }}>*</span>;
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-4 py-2.5 rounded-full text-sm font-medium transition-all"
      style={
        active
          ? {
              background: "linear-gradient(135deg, #d4a017, #f0c040)",
              color: "#0a1f0b",
              border: "1.5px solid transparent",
            }
          : {
              background: "rgba(255,255,255,0.04)",
              border: "1.5px solid rgba(245,240,232,0.15)",
              color: "var(--cream)",
            }
      }
    >
      {children}
    </button>
  );
}

type Photo = { previewUrl: string; uploading: boolean; uploadedUrl?: string; error?: string };

export default function BookPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [wasteTypes, setWasteTypes] = useState<string[]>([]);
  const [wasteLocation, setWasteLocation] = useState<string[]>([]);
  const [dismantling, setDismantling] = useState<boolean | null>(null);
  const [floor, setFloor] = useState("");
  const [access, setAccess] = useState<string[]>([]);
  const [preferredDate, setPreferredDate] = useState<string | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [website, setWebsite] = useState(""); // honeypot
  const formLoadedAt = useRef(Date.now());

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function toggle(list: string[], setList: (v: string[]) => void, value: string) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  async function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    const remaining = MAX_PHOTOS - photos.length;
    const toAdd = files.slice(0, remaining);

    for (const file of toAdd) {
      const previewUrl = URL.createObjectURL(file);
      setPhotos((prev) => [...prev, { previewUrl, uploading: true }]);

      const fd = new FormData();
      fd.append("file", file);
      try {
        const res = await fetch("/api/bookings/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        setPhotos((prev) =>
          prev.map((p) => (p.previewUrl === previewUrl ? { ...p, uploading: false, uploadedUrl: data.url } : p))
        );
      } catch (err) {
        setPhotos((prev) =>
          prev.map((p) =>
            p.previewUrl === previewUrl
              ? { ...p, uploading: false, error: err instanceof Error ? err.message : "Upload failed" }
              : p
          )
        );
      }
    }
  }

  function removePhoto(previewUrl: string) {
    URL.revokeObjectURL(previewUrl);
    setPhotos((prev) => prev.filter((p) => p.previewUrl !== previewUrl));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (!firstName || !email || !address) {
      setErrorMsg("Please fill in your name, email and address.");
      return;
    }
    if (wasteTypes.length === 0) {
      setErrorMsg("Please select at least one type of waste.");
      return;
    }
    if (wasteLocation.length === 0) {
      setErrorMsg("Please select where your waste is located.");
      return;
    }
    if (dismantling === null) {
      setErrorMsg("Please let us know if dismantling is required.");
      return;
    }
    if (!floor) {
      setErrorMsg("Please select what floor the waste is on.");
      return;
    }
    if (access.length === 0) {
      setErrorMsg("Please select how we'll access the waste.");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          address,
          wasteTypes,
          wasteLocation,
          dismantling,
          floor,
          access,
          preferredDate,
          additionalInfo,
          photoUrls: photos.filter((p) => p.uploadedUrl).map((p) => p.uploadedUrl),
          website,
          formLoadedAt: formLoadedAt.current,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong");
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please call us directly.");
    }
  }

  return (
    <>
      <ScrollAnimations />
      <Navbar />

      <main className="min-h-screen pt-24 pb-20" style={{ background: "var(--forest-dark)" }}>
        {/* Hero */}
        <section
          className="relative py-16 md:py-20 px-5 md:px-6 text-center overflow-hidden"
          style={{ background: "linear-gradient(180deg, rgba(26,68,29,0.3) 0%, transparent 100%)" }}
        >
          <nav className="relative text-xs tracking-widest uppercase mb-6" style={{ color: "rgba(245,240,232,0.4)" }} aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[var(--gold-light)]">Home</Link>
            <span className="mx-2">/</span>
            <span style={{ color: "rgba(212,160,23,0.7)" }}>Book Now</span>
          </nav>
          <p className="section-label mb-4">Book Online</p>
          <h1
            className="leading-none mb-5"
            style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2.6rem, 8vw, 5rem)", color: "var(--cream)", letterSpacing: "0.02em" }}
          >
            BOOK YOUR <span className="gold-text">COLLECTION</span>
          </h1>
          <p className="max-w-xl mx-auto text-base md:text-lg leading-relaxed" style={{ color: "rgba(245,240,232,0.7)" }}>
            Tell us what needs uplifted and we&apos;ll email you an estimated quote right away:
            no need to pick up the phone.
          </p>
        </section>

        {/* Form */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-10">
          <div
            className="rounded-2xl p-5 sm:p-8 md:p-10"
            style={{
              background: "linear-gradient(145deg, rgba(26,68,29,0.35), rgba(10,31,11,0.7))",
              border: "1px solid rgba(212,160,23,0.15)",
            }}
          >
            {status === "success" ? (
              <div className="text-center py-14">
                <div className="text-5xl mb-4">✓</div>
                <h2 className="text-2xl md:text-3xl font-heading gold-text mb-3">Booking Received</h2>
                <p className="text-sm md:text-base max-w-md mx-auto" style={{ color: "rgba(245,240,232,0.65)" }}>
                  Thanks. We&apos;ve emailed you an estimated quote. We&apos;ll be in touch shortly to confirm your
                  collection date and finalise the details.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-3 font-semibold px-8 py-3.5 rounded-full mt-8"
                  style={{ background: "linear-gradient(135deg, #d4a017, #f0c040)", color: "#0a1f0b" }}
                >
                  Back to Home
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-10">
                {/* Honeypot */}
                <input
                  type="text"
                  name="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", opacity: 0 }}
                />

                {/* Your details */}
                <section>
                  <h2 className="text-xl font-heading text-cream uppercase mb-5" style={{ letterSpacing: "0.04em" }}>
                    Your Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <input placeholder="First name" required value={firstName} onChange={(e) => setFirstName(e.target.value)} style={inputStyle} />
                    <input placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} style={inputStyle} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
                    <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} />
                  </div>
                  <input placeholder="Address / postcode" required value={address} onChange={(e) => setAddress(e.target.value)} style={inputStyle} />
                </section>

                {/* Waste type */}
                <section>
                  <label style={labelStyle}>What type of waste needs removed?{required()}</label>
                  <div className="flex flex-wrap gap-2.5">
                    {WASTE_CATEGORIES.map((c) => (
                      <Chip key={c.key} active={wasteTypes.includes(c.key)} onClick={() => toggle(wasteTypes, setWasteTypes, c.key)}>
                        {c.label}
                      </Chip>
                    ))}
                  </div>
                </section>

                {/* Waste location */}
                <section>
                  <label style={labelStyle}>Where is your waste located?{required()}</label>
                  <div className="flex flex-wrap gap-2.5">
                    {WASTE_LOCATIONS.map((loc) => (
                      <Chip key={loc} active={wasteLocation.includes(loc)} onClick={() => toggle(wasteLocation, setWasteLocation, loc)}>
                        {loc}
                      </Chip>
                    ))}
                  </div>
                </section>

                {/* Dismantling */}
                <section>
                  <label style={labelStyle}>Is dismantling required?{required()}</label>
                  <div className="flex gap-2.5">
                    <Chip active={dismantling === true} onClick={() => setDismantling(true)}>Yes</Chip>
                    <Chip active={dismantling === false} onClick={() => setDismantling(false)}>No</Chip>
                  </div>
                </section>

                {/* Floor */}
                <section>
                  <label style={labelStyle}>What floor is the waste on?{required()}</label>
                  <div className="flex flex-wrap gap-2.5">
                    {FLOOR_OPTIONS.map((f) => (
                      <Chip key={f} active={floor === f} onClick={() => setFloor(f)}>{f}</Chip>
                    ))}
                  </div>
                </section>

                {/* Access */}
                <section>
                  <label style={labelStyle}>How is access to the waste?{required()}</label>
                  <div className="flex flex-wrap gap-2.5">
                    {ACCESS_OPTIONS.map((a) => (
                      <Chip key={a} active={access.includes(a)} onClick={() => toggle(access, setAccess, a)}>{a}</Chip>
                    ))}
                  </div>
                </section>

                {/* Calendar */}
                <section>
                  <label style={labelStyle}>Preferred collection date</label>
                  <BookingCalendar value={preferredDate} onChange={setPreferredDate} />
                  <p className="text-xs mt-3" style={{ color: "rgba(245,240,232,0.4)" }}>
                    {preferredDate
                      ? `Selected: ${new Date(`${preferredDate}T00:00:00`).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}`
                      : "Optional. We'll confirm a suitable time with you using your contact details."}
                  </p>
                </section>

                {/* Photos */}
                <section>
                  <label style={labelStyle}>Photos (optional)</label>
                  <p className="text-xs mb-3" style={{ color: "rgba(245,240,232,0.45)" }}>
                    Include a few photos from different angles so we can give you the most accurate quote.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {photos.map((p) => (
                      <div key={p.previewUrl} className="relative w-20 h-20 rounded-lg overflow-hidden" style={{ border: "1px solid rgba(212,160,23,0.25)" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.previewUrl} alt="Waste photo" className="w-full h-full object-cover" />
                        {p.uploading && (
                          <div className="absolute inset-0 flex items-center justify-center text-[10px] text-cream" style={{ background: "rgba(10,31,11,0.7)" }}>
                            Uploading…
                          </div>
                        )}
                        {p.error && (
                          <div className="absolute inset-0 flex items-center justify-center text-[10px] text-red-300 text-center p-1" style={{ background: "rgba(10,31,11,0.85)" }}>
                            Failed
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removePhoto(p.previewUrl)}
                          aria-label="Remove photo"
                          className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs"
                          style={{ background: "rgba(10,31,11,0.85)", color: "var(--cream)" }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {photos.length < MAX_PHOTOS && (
                      <label
                        htmlFor="photoInput"
                        className="w-20 h-20 rounded-lg flex items-center justify-center cursor-pointer text-xs text-center"
                        style={{ border: "1.5px dashed rgba(212,160,23,0.4)", color: "rgba(212,160,23,0.7)" }}
                      >
                        + Add
                      </label>
                    )}
                  </div>
                  <input id="photoInput" type="file" accept="image/*" multiple onChange={handlePhotoSelect} className="hidden" />
                </section>

                {/* Additional info */}
                <section>
                  <label style={labelStyle}>Additional information / comments</label>
                  <textarea
                    rows={4}
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    placeholder="Anything else we should know?"
                    style={{ ...inputStyle, resize: "vertical" }}
                  />
                </section>

                {errorMsg && (
                  <p className="text-sm text-red-400 bg-red-900/20 border border-red-900/40 rounded-sm p-3">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-4 rounded-full font-semibold text-base"
                  style={{ background: "linear-gradient(135deg, #d4a017, #f0c040)", color: "#0a1f0b", boxShadow: "0 8px 32px rgba(212,160,23,0.3)" }}
                >
                  {status === "loading" ? "Sending…" : "Get My Free Quote"}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
