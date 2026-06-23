import { useState } from "react";

interface AuthFormProps {
  mode: "login" | "register";
  onSubmit: (data: { name?: string; email: string; password: string }) => void;
  onModeChange?: (mode: "login" | "register") => void;
  loading: boolean;
}

const AuthForm = ({ mode, onSubmit, onModeChange, loading }: AuthFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...(mode === "register" && { name }),
      email,
      password,
    });
  };

  const isLogin = mode === "login";

  return (
    <div className="w-full max-w-[420px]">
      {/* Mobile brand — only shows on small screens */}
      <div className="flex items-center gap-2 mb-8 lg:hidden">
        <span className="w-2 h-2 rounded-full bg-white" />
        <span className="text-sm font-medium text-white/85">Snip</span>
      </div>

      {/* Eyebrow */}
      <p className="text-[10px] tracking-[0.14em] uppercase text-white/30 mb-1">
        Get started
      </p>

      {/* Heading */}
      <h2 className="text-2xl font-semibold text-white mb-1">
        {isLogin ? "Welcome back" : "Create account"}
      </h2>
      <p className="text-[13px] text-white/35 mb-6">
        {isLogin
          ? "Sign in to your account"
          : "Start shortening links for free"}
      </p>

      {/* Mode toggle */}
      <div className="grid grid-cols-2 border border-white/10 rounded-lg p-[3px] mb-6">
        {(["login", "register"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => onModeChange?.(m)}
            className={`py-[7px] text-[13px] font-medium rounded-md transition-all duration-150 ${
              mode === m
                ? "bg-white/10 text-white"
                : "text-white/35 hover:text-white/60"
            }`}
          >
            {m === "login" ? "Sign in" : "Register"}
          </button>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name — register only */}
        {!isLogin && (
          <div>
            <label className="block text-[12px] text-white/40 mb-1.5">
              Full name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Satyam Kumar"
              required
              className="w-full h-[42px] bg-[#111] border border-white/10 rounded-lg px-3.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-white/35 transition-colors"
            />
          </div>
        )}

        {/* Email */}
        <div>
          <label className="block text-[12px] text-white/40 mb-1.5">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full h-[42px] bg-[#111] border border-white/10 rounded-lg px-3.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-white/35 transition-colors"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-[12px] text-white/40 mb-1.5">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full h-[42px] bg-[#111] border border-white/10 rounded-lg px-3.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-white/35 transition-colors"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-[42px] mt-1 bg-white text-[#111] text-sm font-semibold rounded-lg flex items-center justify-center gap-1.5 hover:opacity-88 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
        >
          {loading ? (
            "Loading..."
          ) : (
            <>
              {isLogin ? "Sign in" : "Create account"}
              <span className="text-base">→</span>
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-2.5 my-5">
        <span className="flex-1 h-px bg-white/[0.07]" />
        <span className="text-xs text-white/20">or</span>
        <span className="flex-1 h-px bg-white/[0.07]" />
      </div>

      {/* Switch mode */}
      <p className="text-center text-[13px] text-white/30">
        {isLogin ? "No account?" : "Already have one?"}{" "}
        <button
          type="button"
          onClick={() => onModeChange?.(isLogin ? "register" : "login")}
          className="text-white/75 font-medium hover:text-white transition-colors"
        >
          {isLogin ? "Create one" : "Sign in"}
        </button>
      </p>
    </div>
  );
};

export default AuthForm;
