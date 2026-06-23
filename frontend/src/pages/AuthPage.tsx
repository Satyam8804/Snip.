import React from "react";

type AuthPageProps = {
  children: React.ReactNode;
};
const AuthPage = ({ children }: AuthPageProps) => {
  return (
    <div className="min-h-screen bg-[#111] flex items-stretch">
      {/* Left branding panel */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] xl:w-[40%] bg-[#111] border-r border-white/[0.07] px-10 py-9 shrink-0">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-white" />
          <span className="text-sm font-medium text-white/85">Snip</span>
        </div>

        {/* Hero copy */}
        <div>
          <p className="text-[10px] tracking-[0.14em] uppercase text-white/30 mb-4">
            URL Shortener
          </p>
          <h1 className="text-4xl xl:text-5xl font-semibold text-white leading-[1.15] mb-7">
            Long links,
            <br />
            <span className="text-white/25">made</span> short.
          </h1>

          {/* Stats */}
          <div className="flex gap-8">
            {[
              { num: "6", label: "char codes" },
              { num: "68B+", label: "combinations" },
              { num: "30d", label: "link lifetime" },
            ].map(({ num, label }) => (
              <div key={label}>
                <p className="text-xl font-semibold text-white">{num}</p>
                <p className="text-[11px] text-white/35 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-[13px] text-white/28 leading-relaxed">
          Track clicks, analyse traffic,
          <br />
          manage all your links in one place.
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 bg-[#1a1a1a] flex items-center justify-center px-5 py-10 min-h-screen lg:min-h-0">
        {children}
      </div>
    </div>
  );
};

export default AuthPage;
