const features = [
  { icon: "⚡", name: "Instant redirect", desc: "Links resolve in milliseconds with our optimized infrastructure." },
  { icon: "📊", name: "Click analytics", desc: "Track total clicks, daily trends, and top visitor IPs in real time." },
  { icon: "🔒", name: "Secure & private", desc: "JWT auth, bcrypt passwords, and httpOnly cookies keep you safe." },
  { icon: "⏱️", name: "Link expiry", desc: "Links auto-expire after 30 days. MongoDB TTL handles cleanup." },
  { icon: "🎯", name: "Custom codes", desc: "Base62 generated 6-char codes with collision detection built in." },
  { icon: "📋", name: "Link dashboard", desc: "View, manage and delete all your links in one place." },
];

const Features = () => {
  return (
    <section className="py-20 px-4 bg-gray-50 border-b border-gray-100">
      <div className="text-center mb-12">
        <p className="text-[11px] font-medium uppercase tracking-widest text-gray-400 mb-2">
          Why Snip
        </p>
        <h2 className="text-3xl font-medium text-gray-900 tracking-tight mb-2">
          Everything you need
        </h2>
        <p className="text-[14px] text-gray-500">
          Simple, fast, and powerful link management
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto">
        {features.map((f) => (
          <div
            key={f.name}
            className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors"
          >
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-base mb-3">
              {f.icon}
            </div>
            <p className="text-[13px] font-medium text-gray-900 mb-1.5">{f.name}</p>
            <p className="text-[12px] text-gray-500 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;