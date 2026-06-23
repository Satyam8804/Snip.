import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/hook";
import api from "../api/axios";

const EXAMPLES = [
  {
    long: "https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms/",
    short: "snip.io/d9Kx2m",
  },
  {
    long: "https://www.amazon.in/dp/B09G3HRMVB?ref=sr_1_1&keywords=phone&qid=123456",
    short: "snip.io/aB3nQ1",
  },
  {
    long: "https://github.com/satyam8804/url-shortener/pull/42/files?diff=unified",
    short: "snip.io/gH7pR4",
  },
];

const STATS = [
  { val: "6", label: "char codes" },
  { val: "68B+", label: "combinations" },
  { val: "30d", label: "link lifetime" },
  { val: "302", label: "redirect type" },
];

const isValidUrl = (value: string): boolean => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

const Hero = () => {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleShorten = async () => {
    if (!url) return;
    if (!isValidUrl(url)) {
      setError("Please enter a valid URL (e.g. https://google.com)");
      return;
    }
    setError("");
    try {
      setLoading(true);
      const res = await api.post("/shorten", { url });
      setShortUrl(res.data.data.shortUrl);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section className="relative min-h-[calc(100vh-52px)] flex flex-col items-center justify-center px-4 py-16 text-center bg-white border-b border-gray-100 overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(#f0f0f0_1px,transparent_1px),linear-gradient(90deg,#f0f0f0_1px,transparent_1px)] bg-[size:40px_40px] opacity-50 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,transparent_0%,white_75%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-1.5 bg-gray-100 border border-gray-200 rounded-full px-3 py-1 text-[11px] text-gray-500 mb-6"
          style={{ animation: "fadeUp 0.4s forwards", opacity: 0 }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
          Fast, free URL shortener
        </div>

        {/* Headline */}
        <h1
          className="text-5xl sm:text-6xl font-medium text-gray-900 tracking-tight leading-tight mb-4"
          style={{ animation: "fadeUp 0.4s 0.08s forwards", opacity: 0 }}
        >
          Long links, <span className="text-gray-300">made</span> short.
        </h1>

        <p
          className="text-[15px] text-gray-500 max-w-sm mx-auto mb-8 leading-relaxed"
          style={{ animation: "fadeUp 0.4s 0.16s forwards", opacity: 0 }}
        >
          Paste your URL and get a short shareable link instantly. Track clicks
          and analytics for every link.
        </p>

        {/* Animated examples */}
        <div className="flex flex-col gap-1.5 mb-8">
          {EXAMPLES.map((ex, i) => (
            <div
              key={ex.short}
              className="flex items-center justify-center gap-2"
              style={{
                animation: "fadeUp 0.4s forwards",
                animationDelay: `${0.24 + i * 0.1}s`,
                opacity: 0,
              }}
            >
              <span className="text-[11px] text-gray-300 font-mono truncate max-w-[240px]">
                {ex.long}
              </span>
              <span className="text-[11px] text-gray-300">→</span>
              <span className="text-[11px] text-gray-800 font-mono font-medium bg-gray-100 px-2 py-0.5 rounded">
                {ex.short}
              </span>
            </div>
          ))}
        </div>

        {/* Input */}
        <div style={{ animation: "fadeUp 0.4s 0.54s forwards", opacity: 0 }}>
          <div className="flex gap-2 bg-gray-100 border border-gray-200 rounded-xl p-1.5 mb-2">
            <input
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleShorten()}
              placeholder="Paste your long URL here..."
              className="flex-1 h-9 px-3 bg-transparent text-[13px] text-gray-900 placeholder:text-gray-400 outline-none"
            />
            <button
              onClick={handleShorten}
              disabled={loading}
              className="h-9 px-5 bg-gray-900 text-white text-[13px] font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
            >
              {loading ? "Shortening..." : "Shorten →"}
            </button>
          </div>

          {/* Error */}
          {error && (
            <p className="text-[12px] text-red-500 text-left px-1 mb-2">
              ⚠️ {error}
            </p>
          )}
        </div>

        {/* Result */}
        {shortUrl && (
          <div className="flex flex-col gap-2 mt-1">
            <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
              <span className="text-[13px] text-green-700 font-mono truncate mr-3">
                {shortUrl}
              </span>
              <button
                onClick={handleCopy}
                className="text-[11px] text-green-700 border border-green-200 px-2.5 py-1 rounded-md hover:bg-green-100 transition-colors whitespace-nowrap cursor-pointer"
              >
                {copied ? "Copied!" : "Copy link"}
              </button>
            </div>

            {!isAuthenticated && (
              <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm">📊</span>
                  <span className="text-[12px] text-gray-500">
                    <span className="text-gray-900 font-medium">Sign in</span>{" "}
                    to track clicks & analytics for this link
                  </span>
                </div>
                <button
                  onClick={() => navigate("/login")}
                  className="text-[11px] font-medium text-gray-900 border border-gray-300 bg-white px-2.5 py-1 rounded-md hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer ml-3"
                >
                  Sign in →
                </button>
              </div>
            )}

            {isAuthenticated && (
              <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm">🔗</span>
                  <span className="text-[12px] text-gray-500">
                    Link saved to your{" "}
                    <span className="text-gray-900 font-medium">dashboard</span>
                  </span>
                </div>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="text-[11px] font-medium text-gray-900 border border-gray-300 bg-white px-2.5 py-1 rounded-md hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer ml-3"
                >
                  View dashboard →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Stats */}
        <div
          className="flex items-center justify-center gap-8 mt-12 pt-8 border-t border-gray-100"
          style={{ animation: "fadeUp 0.4s 0.6s forwards", opacity: 0 }}
        >
          {STATS.map((s, i) => (
            <>
              {i > 0 && (
                <div key={`divider-${i}`} className="w-px h-7 bg-gray-100" />
              )}
              <div key={s.val} className="text-center">
                <div className="text-xl font-medium text-gray-900 tracking-tight font-mono">
                  {s.val}
                </div>
                <div className="text-[11px] text-gray-400 mt-0.5">
                  {s.label}
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
