import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#0f0f0f] px-6 py-5 flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-[#444]" />
        <span className="text-[13px] font-medium text-[#444]">Snip</span>
      </div>

      <span className="text-[11px] text-[#444]">
        © 2026 Snip. All rights reserved.
      </span>

      <div className="flex items-center gap-4">
        {["Privacy", "Terms", "Contact"].map((item) => (
          <Link
            key={item}
            to={`/${item.toLowerCase()}`}
            className="text-[11px] text-[#444] hover:text-[#888] transition-colors"
          >
            {item}
          </Link>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
