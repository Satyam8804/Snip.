import { useState, useEffect } from "react";
import { useNavigate ,Link} from "react-router-dom";
import api from "../api/axios";
import type { Url } from "../types";

const Dashboard = () => {
  const navigate = useNavigate();
  const [urls, setUrls] = useState<Url[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLinks, setTotalLinks] = useState(0);

  // Helper functions
  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const activeLinks = urls.filter((u) => !isExpired(u.expiresAt)).length;
  const totalClicks = urls.reduce((acc, url) => acc + url.clicks, 0);

  // Fetch
  const fetchUrls = async (page = 1) => {
    try {
      setLoading(true);
      const res = await api.get(`/urls?page=${page}&limit=10`);
      setUrls(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
      setTotalLinks(res.data.pagination.totalUrls ?? res.data.data.length);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls(currentPage);
  }, [currentPage]);

  // Delete
  const handleDelete = async (code: string) => {
    try {
      await api.delete(`/urls/${code}`);
      fetchUrls(currentPage);
    } catch (error) {
      console.error(error);
    }
  };

  // Copy
  const handleCopy = (code: string, btn: HTMLButtonElement) => {
    navigator.clipboard.writeText(
      `${import.meta.env.VITE_BASE_URL?.replace("/api", "")}/${code}`
    );
    btn.textContent = "✓ Copied";
    setTimeout(() => (btn.textContent = "📋 Copy"), 1500);
  };

  if (loading)
    return (
      <div className="min-h-[calc(100vh-52px)] flex items-center justify-center">
        <p className="text-[13px] text-gray-400">Loading your links...</p>
      </div>
    );

  return (
    <div className="min-h-[calc(100vh-52px)] bg-gray-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-xl font-medium text-gray-900 tracking-tight">
              My Links
            </h1>
            <p className="text-[13px] text-gray-400 mt-0.5">
              Manage and track all your shortened URLs
            </p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="h-[34px] px-4 bg-gray-900 text-white text-[13px] font-medium rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
          >
            + Shorten new
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: "Total Links", val: totalLinks, hint: "All time" },
            {
              label: "Total Clicks",
              val: totalClicks,
              hint: "Across all links",
            },
            { label: "Active Links", val: activeLinks, hint: "Not expired" },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white border border-gray-200 rounded-xl px-5 py-4"
            >
              <p className="text-[11px] text-gray-400 uppercase tracking-widest mb-1">
                {s.label}
              </p>
              <p className="text-2xl font-medium text-gray-900 font-mono tracking-tight">
                {s.val}
              </p>
              <p className="text-[11px] text-gray-300 mt-0.5">{s.hint}</p>
            </div>
          ))}
        </div>

        {/* URL Cards */}
        {urls.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-3xl mb-3">🔗</div>
            <p className="text-[15px] font-medium text-gray-900 mb-1">
              No links yet
            </p>
            <p className="text-[13px] text-gray-400">
              Shorten your first URL to get started
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {urls.map((url) => (
              <div
                key={url._id}
                className="bg-white border border-gray-200 rounded-xl px-5 py-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-gray-900 font-mono mb-1">
                      {`${import.meta.env.VITE_BASE_URL?.replace("/api", "")}/${
                        url.code
                      }`}
                    </p>
                    <p className="text-[12px] text-gray-400 truncate">
                      {url.longUrl}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={(e) => handleCopy(url.code, e.currentTarget)}
                      className="h-7 px-2.5 text-[11px] font-medium text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      📋 Copy
                    </button>
                    <Link
                      to= {`/analytics/${url.code}`}
                      className="h-7 px-2.5 text-[11px] font-medium text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      📊 Analytics
                    </Link>
                    <button
                      onClick={() => handleDelete(url.code)}
                      className="h-7 px-2.5 text-[11px] font-medium text-red-400 border border-red-100 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 bg-green-50 border border-green-200 rounded-full px-2.5 py-0.5 text-[11px] text-green-700 font-medium">
                    ↗ {url.clicks} clicks
                  </span>
                  {url.expiresAt && (
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] border ${
                        isExpired(url.expiresAt)
                          ? "bg-red-50 border-red-100 text-red-400"
                          : "bg-gray-50 border-gray-200 text-gray-400"
                      }`}
                    >
                      ⏱{" "}
                      {isExpired(url.expiresAt)
                        ? "Expired"
                        : `Expires ${formatDate(url.expiresAt)}`}
                    </span>
                  )}
                  <span className="text-[11px] text-gray-300">
                    Created {formatDate(url.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-6">
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
              className="h-[30px] px-3 text-[12px] text-gray-500 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              ←
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`h-[30px] w-[30px] text-[12px] rounded-md border cursor-pointer ${
                  p === currentPage
                    ? "bg-gray-900 text-white border-gray-900"
                    : "text-gray-500 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
              className="h-[30px] px-3 text-[12px] text-gray-500 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
