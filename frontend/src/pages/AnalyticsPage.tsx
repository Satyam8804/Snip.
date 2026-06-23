import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import type { Analytics } from "../types";

const AnalyticsPage = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get(`/urls/analytics/${code}`);
        setData(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [code]);

  const handleCopy = () => {
    if (!data) return;
    navigator.clipboard.writeText(data.shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const formatDateTime = (date: string) =>
    new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const last7DaysTotal =
    data?.last7Days.reduce((acc, d) => acc + d.clicks, 0) ?? 0;
  const uniqueIPs = data?.topIps.length ?? 0;

  const fillLast7Days = (data: { date: string; clicks: number }[]) => {
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0]; // "2026-06-21"
      const found = data.find((item) => item.date === dateStr);
      result.push({
        date: dateStr,
        clicks: found ? found.clicks : 0,
      });
    }
    return result;
  };

  const filledDays = fillLast7Days(data?.last7Days ?? []);
  const maxClicks = Math.max(...filledDays.map((d) => d.clicks), 1);

  if (loading)
    return (
      <div className="min-h-[calc(100vh-52px)] flex items-center justify-center">
        <p className="text-[13px] text-gray-400">Loading analytics...</p>
      </div>
    );

  if (!data)
    return (
      <div className="min-h-[calc(100vh-52px)] flex items-center justify-center">
        <p className="text-[13px] text-red-400">Failed to load analytics.</p>
      </div>
    );

  return (
    <div className="min-h-[calc(100vh-52px)] bg-gray-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-gray-900 transition-colors cursor-pointer mb-5"
        >
          ← Back to dashboard
        </button>

        {/* Header card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-3">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <p className="text-lg font-medium text-gray-900 font-mono tracking-tight mb-1">
                {data.shortUrl}
              </p>
              <p className="text-[12px] text-gray-400 truncate">
                {data.longUrl}
              </p>
            </div>
            <button
              onClick={handleCopy}
              className="h-7 px-3 text-[11px] text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
            >
              {copied ? "✓ Copied" : "📋 Copy link"}
            </button>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 bg-gray-100 rounded-full px-2.5 py-1 text-[11px] text-gray-500">
              📅 Created {formatDate(data.createdAt)}
            </span>
            {data.expiresAt && (
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] ${
                  isExpired(data.expiresAt)
                    ? "bg-red-50 text-red-400"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                ⏱{" "}
                {isExpired(data.expiresAt)
                  ? "Expired"
                  : `Expires ${formatDate(data.expiresAt)}`}
              </span>
            )}
            <span className="inline-flex items-center gap-1 bg-green-50 rounded-full px-2.5 py-1 text-[11px] text-green-700 font-medium">
              ↗ {data.totalClicks} total clicks
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-3">
          {[
            { label: "Total Clicks", val: data.totalClicks, hint: "All time" },
            {
              label: "Last 7 Days",
              val: last7DaysTotal,
              hint: "Recent activity",
            },
            { label: "Unique IPs", val: uniqueIPs, hint: "Distinct visitors" },
            {
              label: "Days Active",
              val: Math.ceil(
                (new Date().getTime() - new Date(data.createdAt).getTime()) /
                  (1000 * 60 * 60 * 24)
              ),
              hint: "Since created",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white border border-gray-200 rounded-xl px-4 py-3"
            >
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">
                {s.label}
              </p>
              <p className="text-2xl font-medium text-gray-900 font-mono tracking-tight">
                {s.val}
              </p>
              <p className="text-[11px] text-gray-300 mt-0.5">{s.hint}</p>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          {/* Bar chart — last 7 days */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-[12px] font-medium text-gray-900 mb-4">
              Clicks — Last 7 Days
            </p>
            <div className="flex items-end gap-1.5 h-24">
              {filledDays.map((d) => (
                <div
                  key={d.date}
                  className="flex flex-col items-center gap-1 flex-1"
                >
                  {d.clicks > 0 && (
                    <span className="text-[9px] text-gray-400">{d.clicks}</span>
                  )}
                  <div
                    className={`w-full rounded-t-sm min-h-[3px] hover:opacity-70 transition-opacity ${
                      d.clicks > 0 ? "bg-gray-900" : "bg-gray-100" // 0 clicks = light bar
                    }`}
                    style={{ height: `${(d.clicks / maxClicks) * 80}px` }}
                  />
                  <span className="text-[9px] text-gray-300 font-mono">
                    {new Date(d.date).getDate()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top IPs */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-[12px] font-medium text-gray-900 mb-4">
              Top Visitors by IP
            </p>
            <div className="flex flex-col gap-3">
              {data.topIps.map((item, i) => (
                <div key={item.ip} className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-300 w-3">{i + 1}</span>
                  <span className="text-[11px] text-gray-500 font-mono w-32 truncate">
                    {item.ip}
                  </span>
                  <div className="flex-1 h-1 bg-gray-100 rounded-full">
                    <div
                      className="h-full bg-gray-900 rounded-full"
                      style={{
                        width: `${(item.count / data.topIps[0].count) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-[11px] text-gray-400 w-6 text-right">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent clicks log */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-[12px] font-medium text-gray-900 mb-4">
            Recent Clicks
          </p>
          {data.last7Days.length === 0 ? (
            <p className="text-[13px] text-gray-400 text-center py-4">
              No clicks yet
            </p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-[10px] text-gray-400 uppercase tracking-widest text-left pb-2">
                    #
                  </th>
                  <th className="text-[10px] text-gray-400 uppercase tracking-widest text-left pb-2">
                    IP Address
                  </th>
                  <th className="text-[10px] text-gray-400 uppercase tracking-widest text-left pb-2">
                    Date
                  </th>
                  <th className="text-[10px] text-gray-400 uppercase tracking-widest text-right pb-2">
                    Clicks
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.last7Days.map((d, i) => (
                  <tr
                    key={d.date}
                    className="border-b border-gray-50 last:border-none"
                  >
                    <td className="text-[12px] text-gray-400 py-2 font-mono">
                      {i + 1}
                    </td>
                    <td className="text-[12px] text-gray-500 py-2 font-mono">
                      —
                    </td>
                    <td className="text-[12px] text-gray-500 py-2 font-mono">
                      {formatDate(d.date)}
                    </td>
                    <td className="text-[12px] text-gray-900 py-2 font-mono text-right font-medium">
                      {d.clicks}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
